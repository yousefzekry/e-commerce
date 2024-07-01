const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: [true, "This email already exists"],
		trim: true,
	},
	username: {
		type: String,
		trim: true,
	},
	role: {
		type: String,
		default: "user",
		trim: true,
	},
	CreatedAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
	// password: {
	// 	type: String,
	// 	required: true,
	// },
	// confirmPassword: {
	// 	type: String,
	// 	required: true,
	// },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
