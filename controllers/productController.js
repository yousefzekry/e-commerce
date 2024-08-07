const Product = require("./../model/productModel");
const Category = require("./../model/categoryModel");
const { query } = require("express");
const APIFeatures = require("../middlewares/apiFeatures");
const asyncWrapper = require("./../middlewares/ayncWrapper");
const errorHandler = require("./../middlewares/errorHandler");
exports.aliasTopProducts = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price";
	req.query.fields = "name,price,description,category";
	next();
};
exports.getAllProducts = asyncWrapper(async (req, res, next) => {
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
});

exports.createProduct = asyncWrapper(async (req, res, next) => {
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
		user: req.user.id,
	});

	await product.save();

	res.status(201).json({
		status: "success",
		data: {
			product,
		},
	});
});

exports.getProduct = asyncWrapper(async (req, res, next) => {
	const product = await Product.findById(req.params.id).populate("categories");
	if (!product) {
		return next(new errorHandler("No product found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: { product },
	});
});

exports.updateProduct = asyncWrapper(async (req, res, next) => {
	// Log the incoming request body and params
	console.log("Request body:", req.body);
	console.log("Request params:", req.params);

	const {
		name,
		description,
		price,
		quantity,
		discount,
		categoryNames,
		imageCover,
		images,
	} = req.body;

	// Prepare the update object
	const updateData = {};
	if (name !== undefined) updateData.name = name;
	if (description !== undefined) updateData.description = description;
	if (price !== undefined) updateData.price = price;
	if (quantity !== undefined) updateData.quantity = quantity;
	if (discount !== undefined) updateData.discount = discount;
	if (imageCover !== undefined) updateData.imageCover = imageCover;
	if (images !== undefined) updateData.images = images;

	// If categoryNames are provided, handle them separately
	if (categoryNames !== undefined) {
		if (!Array.isArray(categoryNames)) {
			return res.status(400).json({
				status: "fail",
				message: "categoryNames should be an array",
			});
		}

		// Find categories by names
		const categories = await Category.find({ name: { $in: categoryNames } });
		console.log("Found categories:", categories);

		if (categories.length !== categoryNames.length) {
			return res.status(400).json({
				status: "fail",
				message: "One or more categories are invalid",
			});
		}

		const categoryIds = categories.map(category => category._id);
		updateData.categories = categoryIds;
	}

	// Check if req.params.id is present
	if (!req.params.id) {
		return next(new errorHandler("No product found with that ID", 404));
	}

	const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		return next(new errorHandler("No product found with that ID", 404));
	}
	if (product.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new errorHandler("You do not have permission to perform this action", 403)
		);
	}

	res.status(200).json({
		status: "success",
		data: { product },
	});
});

exports.deleteProduct = asyncWrapper(async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (!product) {
		return next(new errorHandler("No product found with that ID", 404));
	}
	// Check if the logged-in user is the owner of the product or an admin
	if (product.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new errorHandler("You do not have permission to perform this action", 403)
		);
	}
	res.status(204).json({
		status: "success",
		data: null,
	});
});
