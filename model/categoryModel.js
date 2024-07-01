const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A category name is required"],
		unique: [true, "The category name already exists"],
		trim: true,
	},
	CreatedAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
