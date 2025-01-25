const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		function (email, password, done) {
			// Here you would look up the user in your DB and check the password
			User.findOne({ email: email.toLowerCase() }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: "Incorrect username." });
				}

				user.comparePassword(password, (err, isMatch) => {
					if (err) return done(err); // 에러인 경우
					if (isMatch) return done(null, user); // 비밀번호가 일치하는 경우

					return done(null, false, { message: "Invalid email or password" }); // 비밀번호가 일치하지 않는 경우
				});
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
