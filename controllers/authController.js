const User = require("./../model/userModel");
const asyncWrapper = require("./../middlewares/ayncWrapper");

exports.signup = asyncWrapper(async (req, res, next) => {
	const newUser = await User.create(req.body);

	res.status(201).json({
		status: "success",
		data: {
			user: newUser,
		},
	});
});
