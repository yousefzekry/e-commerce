const User = require("./../model/userModel");

exports.getAllUsers = (req, res) => {
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
};
exports.getUser = (req, res) => {
	const id = req.params.id * 1;
	const user = users.find(el => el.id === id);

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
exports.updateUser = (req, res) => {
	const id = req.params.id * 1;

	const userId = users.findIndex(el => el.id === id);
	if (!userId) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid id",
		});
	}
	const existingUser = users[userId];
	const updatedUser = Object.assign({}, existingUser, req.body, { id });
	users[userId] = updatedUser;

	fs.writeFile(
		`${__dirname}/../dev-data/data/users.json`,
		JSON.stringify(users),
		err => {
			if (err) {
				return res.status(500).json({
					status: "error",
					message: "This route is not yet defined",
				});
			}
			res.status(200).json({
				status: "success",
				data: updatedUser,
			});
		}
	);
};
exports.deleteUser = (req, res) => {
	const id = req.params.id * 1;

	const index = users.find(el => el.id === id);
	if (!index) {
		return res.status(404).json({
			status: "fail",
			message: "invalid id",
		});
	}
	users.splice(id, 1);
	fs.writeFile(
		`${__dirname}/../dev-data/data/users.json`,
		JSON.stringify(users),
		err => {
			if (err) {
				return res.status(500).json({
					status: "error",
					message: "internal server error",
				});
			}
			res.status(204).json({
				status: "success",
				data: null,
			});
		}
	);
};
