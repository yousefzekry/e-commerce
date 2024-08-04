const { query } = require("express");
const APIFeatures = require("../middlewares/apiFeatures");
const asyncWrapper = require("./../middlewares/ayncWrapper");
const errorHandler = require("./../middlewares/errorHandler");
const User = require("./../model/userModel");

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
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
});

exports.updateMe = asyncWrapper(async (req, res, next) => {
	//1) Create error if user POSTs password
	if (req.body.password || req.body.confirmPassword) {
		return next(
			new errorHandler(
				"This route is not for password updates. Please use /updateMyPassword.",
				400
			)
		);
	}
	// 2) filter out the unwanted fields names that are not allowed to be updated.
	const filteredBody = filterObj(req.body, "name", "email");
	// 3) Update user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

exports.getUser = asyncWrapper(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new errorHandler("No user found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			user,
		},
	});
});

exports.createUser = asyncWrapper(async (req, res, next) => {
	const newUser = await User.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			users: newUser,
		},
	});
});
exports.updateUser = asyncWrapper(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!user) {
		return next(new errorHandler("No user found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			User,
		},
	});
});
exports.deleteUser = asyncWrapper(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		return next(new errorHandler("No user found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: null,
	});
});
