const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, "please confirm your password"],
		validate: {
			//this only validate on CREATE and on SAVE
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same!",
		},
	},
	CreatedAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
});

userSchema.pre("save", async function (next) {
	//Only run this function if passwords was actually modified
	if (!this.isModified("password")) return next();

	// Hash the password with 12 salt
	this.password = await bcrypt.hash(this.password, 12);

	//Delete password confirm field
	this.confirmPassword = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
