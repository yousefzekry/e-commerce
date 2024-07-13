const mongoose = require("mongoose");
const validator = require("validator");

//name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please Enter Your Name!"],
	},
	email: {
		type: String,
		required: [true, "Please Provide Your Email!"],
		unique: [true, "This email already exists"],
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, "Please Provide a valid Email"],
	},
	role: {
		type: String,
		default: "user",
		trim: true,
	},
	photo: String,
	password: {
		type: String,
		required: [true, "Please Provide a password"],
		minLength: 8,
	},
	confirmPassword: {
		type: String,
		required: [true, "please confirm your password"],
	},
	CreatedAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
