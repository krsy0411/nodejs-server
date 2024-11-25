const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = 4000;
const SECRET_TOKEN = "secretToken";

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
app.post("/login", (req, res) => {
	const username = req.body.username;
	const user = { name: username };

	const accessToken = jwt.sign(user, SECRET_TOKEN);

	res.json({ accessToken });
});

app.get("/posts", authMiddleWare, (req, res) => {
	res.json(posts);
});

// 실행
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
