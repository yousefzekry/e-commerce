const User = require("./../model/userModel");

exports.getAllUsers = async (req, res) => {
	try {
		//Build Query
		const queryObj = { ...req.query };
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach(el => delete queryObj[el]);
		console.log(req.query, queryObj);

		const query = User.find(queryObj);

		//Execute Query
		const users = await query;
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
