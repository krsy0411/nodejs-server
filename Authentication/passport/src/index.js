const express = require("express");
const path = require("path"); // 경로 설정을 위한 모듈
const app = express();
const mongoose = require("mongoose");
const { User } = require("./models/index");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("dotenv").config();

const PORT = 4000;
const CONNECT_STRING = process.env.CONNECT_STRING;
const cookieEncryptionKey = ["key1", "key2"];

app.use(express.json());
/* URL-encoded 형식의 요청 본문을 구문 분석(parsing)하는 미들웨어를 설정 :
HTML 폼에서 전송된 데이터를 해석하여 req.body 객체에 저장 */
app.use(express.urlencoded({ extended: false }));

// passport : cookie-session 설정(주의 : 늘 passport 모듈 초기화 미들웨어보다 우선시할것)
app.use(
	cookieSession({
		keys: cookieEncryptionKey,
	})
);
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
	if (request.session && !request.session.regenerate) {
		request.session.regenerate = (cb) => {
			cb();
		};
	}
	if (request.session && !request.session.save) {
		request.session.save = (cb) => {
			cb();
		};
	}
	next();
});
// passport 설정
app.use(passport.initialize()); // passport 초기화
app.use(passport.session()); // passport 세션 사용
require("./config/passport"); // passport 설정 파일

// view engine setup
app.set("views", path.join(__dirname, "views")); // views 폴더로 경로 설정
app.set("view engine", "ejs"); // view engine을 ejs로 설정

mongoose
	.connect(CONNECT_STRING)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.render("main");
});
app.get("/login", (req, res) => {
	res.render("login");
});
app.get("/signup", (req, res) => {
	res.render("signup");
});

app.post("/login", async (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err); // 에러 발생 시 다음 미들웨어로 전달
		if (!user) {
			return res.status(400).json({
				success: false,
				message: info.message,
			});
		}
		req.logIn(user, (err) => {
			if (err) return next(err); // 에러 발생 시 다음 미들웨어로 전달

			res.redirect("/"); // 로그인 성공 시 홈페이지로 리다이렉트
		});
	})(req, res, next);
});
app.post("/signup", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		console.error(err);
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port localhost:${PORT}`);
});
