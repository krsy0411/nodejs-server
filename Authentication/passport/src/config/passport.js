const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/users");

passport.use(
	"local",
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, { message: "Incorrect email." });
				}
				const isMatch = user.comparePassword(password); // bcrypt 기반의 compare는 아직 안 하므로, 비동기 처리할 필요는 X
				if (!isMatch) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

// 사용자 로그인 시 사용 : 세션에 사용자ID를 저장
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

// 사용자 인증 후 요청이 있을 때마다 호출 : 세션에 저장된 식별자 사용 -> 사용자 정보를 디비에서 조회 -> 조회된 사용자 객체를 요청 객체에 추가
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
