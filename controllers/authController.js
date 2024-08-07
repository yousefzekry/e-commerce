const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");
const asyncWrapper = require("./../middlewares/ayncWrapper");
const errorHandler = require("./../middlewares/errorHandler");
const sendEmail = require("./../middlewares/email");

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		//prevent xss attacks
		httpOnly: true,
	};
	// cookie will only be sent in encrypted connection
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions);
	//remove the password from the creation of user output
	// user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
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
	createAndSendToken(newUser, 201, res);
});

exports.login = asyncWrapper(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new errorHandler("please provide email and password!", 400));
	}
	console.log(email);
	console.log(req.body);
	// 2) Check if user exists && password is correct
	const user = await User.findOne({ email }).select("password");
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new errorHandler("Incorrect Email or Password", 401));
	}

	// 3) If everything is ok, send token to client
	createAndSendToken(user, 200, res);
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

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles['admin']. role = 'user
		if (!roles.includes(req.user.role)) {
			return next(
				new errorHandler(
					"You do not have permission to perform this action",
					403
				)
			);
		}
		next();
	};
};

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
	//1) Get user based on POSTED email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new errorHandler("There is no user with email address.", 404));
	}

	//2) Generate the random token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });
	//3) Send it to user's email
	const resetURL = `$(req.protocol)://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password and confirm password to: ${resetURL}./If you didn't forget your password, please Ignore this email`;

	try {
		await sendEmail({
			email: user.email,
			subject: "your password reset token (valid for 10 min)",
			message,
		});

		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new errorHandler("There was an error sending email. Try again later!"),
			500
		);
	}
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	//2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new errorHandler("Token is invalid or has expired ", 400));
	}
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	//3) Update changedPasswordAt property for the user
	//4) Log the user in, send JWT
	createAndSendToken(user, 200, res);
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
	//1) Get user from collection
	const user = await User.findById(req.user.id).select("+password");
	console.log(req.body);
	//2) Check if posted password is correct
	if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
		return next(new errorHandler("Your current password is worng", 401));
	}

	//3) If so, Update password
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	await user.save();
	//4) Log user in, send JWT
	createAndSendToken(user, 200, res);
});
