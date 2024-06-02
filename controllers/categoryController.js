const { query } = require("express");
const Category = require("./../model/categoryModel");
const category = require("./../model/categoryModel");

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
		res.status(400).json({
			status: "fail",
			message: error.message,
		});
	}
};
exports.getAllCategories = async (req, res) => {
	try {
		//build the query
		const queryObj = { ...req.query };
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach(el => delete queryObj[el]);
		// console.log(req.query, queryObj);
		const query = Category.find(queryObj);
		//excute query
		const categories = await query;
		res.status(200).json({
			status: "success",
			results: categories.length,
			data: {
				categories: categories,
			},
		});
	} catch (err) {
		res.status(404).json({
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
