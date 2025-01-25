/**
 * 미들웨어 함수로, 사용자가 인증되었는지 확인합니다.
 * 인증된 경우 다음 미들웨어로 넘어가고, 그렇지 않은 경우 로그인 페이지로 리다이렉트합니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
function checkAuthentication(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

/**
 * 미들웨어 함수로, 사용자가 인증되지 않았는지 확인합니다.
 * 인증되지 않은 경우 다음 미들웨어로 넘어가고, 그렇지 않은 경우 홈 페이지로 리다이렉트합니다.
 *
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
function checkNotAuthentication(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect("/");
}

module.exports = { checkAuthentication, checkNotAuthentication };
