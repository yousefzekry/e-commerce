const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const asyncWrapper = require("./../middlewares/ayncWrapper");
const errorHandler = require("./../middlewares/errorHandler");

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = asyncWrapper(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		passwordChangedAt: req.body.passwordChangedAt,
	});

	const token = signToken(newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = asyncWrapper(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new errorHandler("please provide email and password!", 400));
	}
	// 2) Check if user exists && password is correct
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new errorHandler("Incorrect Email or Password", 401));
	}

	// 3) If everything is ok, send token to client
	const token = signToken(user._id);
	// console.log("Generated Token:", token); // Ensure token is generated
	res.status(200).json({
		status: "success",
		token,
	});
});

exports.protect = asyncWrapper(async (req, res, next) => {
	// console.log("Headers:", req.headers); // Log headers to debug
	//1) Getting the Token and check if it exists
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// console.log("Extracted Token:", token); // Log token to debug

	if (!token) {
		return next(
			new errorHandler("You are not logged in please loggin to get access", 401)
		);
	}
	//2) Token verification
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	//3) Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new errorHandler("The user belonging to the token no longer exist.", 401)
		);
	}

	//4) Check if user changed password after Token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new errorHandler(
				"User recently changed password! please log in again.",
				401
			)
		);
	}
	//Grant access to protected route
	req.user = currentUser;
	next();
});
