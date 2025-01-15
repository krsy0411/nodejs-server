const express = require("express");
const path = require("path"); // 경로 설정을 위한 모듈
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 4000;
const CONNECT_STRING = process.env.CONNECT_STRING;

app.use(express.json());
/* URL-encoded 형식의 요청 본문을 구문 분석(parsing)하는 미들웨어를 설정 :
HTML 폼에서 전송된 데이터를 해석하여 req.body 객체에 저장 */
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose
	.connect(CONNECT_STRING)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/login", (req, res) => {
	res.render("login");
});
app.get("/signup", (req, res) => {
	res.render("signup");
});

app.listen(PORT, () => {
	console.log(`Server is running on port localhost:${PORT}`);
});
