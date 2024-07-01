const Product = require("./../model/productModel");
const Category = require("./../model/categoryModel");
const { query } = require("express");
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopProducts = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price";
	req.query.fields = "name,price,description,category";
	next();
};
exports.getAllProducts = async (req, res) => {
	try {
		//Execute Query
		const features = new APIFeatures(Product.find(), req.query, "product")
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const products = await features.query;
		res.status(200).json({
			status: "success",
			results: products.length,
			data: { products },
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
			error: error.message,
		});
	}
};

exports.createProduct = async (req, res) => {
	try {
		const { name, price, categoryNames, imageCover, images } = req.body;

		// Find categories by names
		const categories = await Category.find({ name: { $in: categoryNames } });

		if (categories.length !== categoryNames.length) {
			return res.status(400).json({
				status: "fail",
				message: "One or more categories are invalid",
			});
		}

		const categoryIds = categories.map(category => category._id);

		const product = new Product({
			name,
			price,
			categories: categoryIds,
			imageCover,
			images,
		});

		await product.save();

		res.status(201).json({
			status: "success",
			data: {
				product,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
			error: error.message,
		});
	}
};

exports.getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate(
			"categories"
		);
		if (!product) {
			return res.status(404).json({
				status: "fail",
				message: "Invalid product ID",
			});
		}
		res.status(200).json({
			status: "success",
			data: { product },
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
			error: error.message,
		});
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const { name, price, categoryNames, imageCover, images } = req.body;

		// Find categories by names
		const categories = await Category.find({ name: { $in: categoryNames } });

		if (categories.length !== categoryNames.length) {
			return res.status(400).json({
				status: "fail",
				message: "One or more categories are invalid",
			});
		}

		const categoryIds = categories.map(category => category._id);

		const product = await Product.findByIdAndUpdate(
			req.params.id,
			{
				name,
				price,
				categories: categoryIds,
				imageCover,
				images,
			},
			{
				new: true,
				runValidators: true,
			}
		);

		if (!product) {
			return res.status(404).json({
				status: "fail",
				message: "Invalid product ID",
			});
		}

		res.status(200).json({
			status: "success",
			data: { product },
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
			error: error.message,
		});
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({
				status: "fail",
				message: "Invalid product ID",
			});
		}

		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Server error",
			error: error.message,
		});
	}
};
