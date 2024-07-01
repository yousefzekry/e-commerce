const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A product must have a name"],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	price: {
		type: Number,
		required: [true, "A product must have a price"],
	},
	quantity: Number,
	discount: Number,
	imageCover: {
		type: String,
		required: [true, "A product must have a cover image"],
	},
	images: [String],
	CreatedAt: {
		type: Date,
		default: Date.now(),
		select: false,
	},

	categories: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
	],
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
