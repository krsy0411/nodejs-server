const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = 4000;
const SECRET_TOKEN = "secretToken";
const REFRESH_SECRET_TOKEN = "refreshSecretToken";

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
const refreshTokens = [];

const app = express(); // express app 생성

function authMiddleWare(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) {
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

// 실행
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
