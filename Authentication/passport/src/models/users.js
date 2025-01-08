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
	},
});

// 모델 생성해서 내보내기
export const User = mongoose.model("User", userSchema);
