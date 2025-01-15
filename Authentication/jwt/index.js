const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const PORT = 4000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;

// 인증과정에서, 요청 빈도를 제한하기 위한 Rate limiting 설정 : 서버 과부하 방지
const refreshRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15분
	max: 100, // 15분 동안 최대 100개의 요청 허용
	message:
		"해당 IP에서 너무 잦은 요청을 하고 있습니다. 15분 후에 다시 시도해주세요.",
});

// DB역할용 데이터
const posts = [
	{
		username: "John",
		title: "Post 1",
	},
	{
		username: "Jim",
		title: "Post 2",
	},
];
// refresh token 저장용
const refreshTokens = [];

const app = express(); // express app 생성

function authMiddleWare(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	// === : 문자열 비교 : 타이밍 공격에 취약 => !연산자로 변경
	if (!token) {
		return res.sendStatus(401);
	}

	jwt.verify(token, SECRET_TOKEN, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		// 다음 미들웨어에서 user 정보를 사용할 수 있도록 req에 추가
		req.user = user;
		// 다음 미들웨어로 이동
		next();
	});
}

// middleware(global)
app.use(express.json()); // application/json 파싱
app.use(cookieParser()); // cookie 파싱

// http method
app.get("/", (req, res) => {
	// 텍스트 형태로 응답
	res.send("Hello World!");
});

app.post("/login", (req, res) => {
	const username = req.body.username; // 요청으로부터 username 가져오기
	const user = { name: username }; // 빼낸 username을 저장할 형태(객체)로 변환

	// accessToken, refreshToken 생성
	const accessToken = jwt.sign(user, SECRET_TOKEN, { expiresIn: "30s" });
	const refreshToken = jwt.sign(user, REFRESH_SECRET_TOKEN, {
		expiresIn: "1d",
	});
	refreshTokens.push(refreshToken);

	// 응답 : refreshToken은 쿠키에 넣어주고, accessToken은 body에 넣어서 보내준다.
	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.json({ accessToken });
});

app.get("/posts", authMiddleWare, (req, res) => {
	res.json(posts);
});

app.get("/refresh", refreshRateLimiter, (req, res) => {
	// console에 확인
	console.log(refreshTokens);

	const refreshToken = req.cookies.jwt;
	if (!refreshTokens.includes(refreshToken)) {
		return res.sendStatus(403);
	}

	jwt.verify(refreshToken, REFRESH_SECRET_TOKEN, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		const accessToken = jwt.sign({ name: user.name }, SECRET_TOKEN, {
			expiresIn: "30s",
		});
		res.json({ accessToken });
	});
});

// 실행
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
