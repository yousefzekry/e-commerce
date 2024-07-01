const { query } = require("express");
const APIFeatures = require("../utils/apiFeatures");
const User = require("./../model/userModel");

exports.getAllUsers = async (req, res) => {
	try {
		//Build Query
		//1A) Filtering
		// const queryObj = { ...req.query };
		// const excludedFields = ["page", "sort", "limit", "fields"];
		// excludedFields.forEach(el => delete queryObj[el]);
		// console.log(req.query, queryObj);

		// //1B) Advanced Filtering
		// let queryStr = JSON.stringify(queryObj);
		// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		// console.log(JSON.parse(queryStr));

		// let query = User.find(JSON.parse(queryStr));

		// //2) Sorting
		// if (req.query.sort) {
		// 	const sortBy = req.query.sort.split(",").join(" ");
		// 	query = query.sort(sortBy);
		// } else {
		// 	query = query.sort("-createdAt"); // Default sort
		// }
		// //3) limiting fields
		// if (req.query.fields) {
		// 	const fields = req.query.fields.split(",").join(" ");
		// 	query = query.select(fields);
		// } else {
		// 	query = query.select("-__v");
		// }
		// //4) Pagination
		// const page = req.query.page * 1 || 1;
		// const limit = req.query.limit * 1 || 100;
		// const skip = (page - 1) * limit;
		// query = query.skip(skip).limit(limit);

		// if (req.query.page) {
		// 	const numUsers = await User.countDocuments();
		// 	if (skip >= numUsers) throw new Error("This Page Does Not Exist");
		// }
		//Execute Query
		const features = new APIFeatures(User.find(), req.query, "Category")
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const users = await features.query;
		res.status(200).json({
			status: "success",
			results: users.length,
			data: {
				users: users,
			},
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error.message,
		});
	}
};
exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "invalid id",
			});
		}
		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "server error",
			error: error.message,
		});
	}
};

exports.createUser = async (req, res) => {
	try {
		const newUser = await User.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				users: newUser,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};
exports.updateUser = async (req, res) => {
	try {
		await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				User,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
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
