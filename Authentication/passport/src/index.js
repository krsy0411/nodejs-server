const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

const PORT = 4000;
const CONNECT_STRING =
	"mongodb+srv://lee:469FkxGZ98BPy9aU@lee.9vryi.mongodb.net/?retryWrites=true&w=majority&appName=LEE";

app.use(express.json());
/* URL-encoded 형식의 요청 본문을 구문 분석(parsing)하는 미들웨어를 설정 :
HTML 폼에서 전송된 데이터를 해석하여 req.body 객체에 저장 */
app.use(express.urlencoded({ extended: false }));

mongoose
	.connect(CONNECT_STRING)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/static", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
