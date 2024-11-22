const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = 4000;
const SECRET_TOKEN = "secretToken";

const app = express(); // express app 생성

// middleware
app.use(express.json()); // application/json 파싱

app.post("/login", (req, res) => {
	const username = req.body.username;
	const user = { name: username };

	const accessToken = jwt.sign(user, SECRET_TOKEN);

	res.json({ accessToken });
});

// 실행
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
