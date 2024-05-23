const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
	},
	role: {
		type: String,
		default: "user",
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
