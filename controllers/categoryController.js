const { query } = require("express");
const APIFeatures = require("../middlewares/apiFeatures");
const asyncWrapper = require("../middlewares/ayncWrapper");
const errorHandler = require("./../middlewares/errorHandler");
const Category = require("./../model/categoryModel");

exports.createCategory = asyncWrapper(async (req, res, next) => {
	const newCategory = await Category.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			categories: newCategory,
		},
	});
});
exports.getAllCategories = asyncWrapper(async (req, res, next) => {
	//excute query
	const features = new APIFeatures(Category.find(), req.query, "Category")
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const categories = await features.query;
	res.status(200).json({
		status: "success",
		results: categories.length,
		data: {
			categories: categories,
		},
	});
});
exports.getCategory = asyncWrapper(async (req, res, next) => {
	const category = await Category.findById(req.params.id);
	if (!category) {
		return next(new errorHandler("No category found with that ID", 404));
	}
	res.status(200).json({
		status: "Success",
		data: {
			category,
		},
	});
});
exports.updateCategory = asyncWrapper(async (req, res, next) => {
	const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!category) {
		return next(new errorHandler("No category found with that ID", 404));
	}
	res.status(200).json({
		status: "Success",
		data: {
			Category,
		},
	});
});
exports.deleteCategory = asyncWrapper(async (req, res, next) => {
	const category = await Category.findByIdAndDelete(req.params.id);
	if (!category) {
		return next(new errorHandler("No category found with that ID", 404));
	}
	res.status(204).json({
		status: "success",
		data: null,
	});
});

//build the query
//1A) Filtering
// const queryObj = { ...req.query };
// const excludedFields = ["page", "sort", "limit", "fields"];
// excludedFields.forEach(el => delete queryObj[el]);

// // 1B) Advanced filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
// console.log(JSON.parse(queryStr));

// let query = Category.find(JSON.parse(queryStr));
// // 2) Sorting
// if (req.query.sort) {
// 	const sortBy = req.query.sort.split(",").join(" ");
// 	query = query.sort(sortBy);
// } else {
// 	query = query.sort("-createdAt"); // Default sort
// }
// // 2) Sorting
// if (req.query.sort) {
// 	query = query.sort(req.query.sort);
// }
// if (req.query.fields) {
// 	const fields = req.query.fields.split(",").join(" ");
// 	query = query.select(fields);
// } else {
// 	query = query.select("-__v");
// }
//4) Pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
// 	const numCategories = await Category.countDocuments();
// 	if (skip >= numCategories) throw new Error("This Page Does Not Exist");
// }
