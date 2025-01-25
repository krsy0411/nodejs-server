const mongoose = require("mongoose");

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minLength: 5,
	},
	googleId: {
		type: String,
		unique: true,
		sparse: true,
	},
});

userSchema.methods.comparePassword = function (plainPassword) {
	// 원래 : bcrpt 라이브러리를 사용하여 비밀번호를 암호화하고 비교하는 코드
	// 현재 : 비밀번호를 평문으로 저장하고 비교하는 코드
	try {
		if (plainPassword === this.password) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		throw new Error(err);
	}
};

// 모델 생성해서 내보내기
const User = mongoose.model("User", userSchema);
module.exports = { User };
