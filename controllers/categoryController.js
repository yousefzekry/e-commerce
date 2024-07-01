const { query } = require("express");
const APIFeatures = require("../utils/apiFeatures");
const Category = require("./../model/categoryModel");

exports.createCategory = async (req, res) => {
	try {
		const newCategory = await Category.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				categories: newCategory,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "fail",
			message: error.message,
		});
	}
};
exports.getAllCategories = async (req, res) => {
	try {
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
	} catch (err) {
		console.error("Error in getAllCategories:", err);
		res.status(500).json({
			status: "fail",
			message: err.message,
		});
	}
};
exports.getCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({
				status: "fail",
				message: "invalid id",
			});
		}
		res.status(200).json({
			status: "Success",
			data: {
				category,
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
exports.updateCategory = async (req, res) => {
	try {
		await Category.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "Success",
			data: {
				Category,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error.message,
		});
	}
};
exports.deleteCategory = async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id);
		res.status(200).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

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
