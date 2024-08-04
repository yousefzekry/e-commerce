const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");

process.on("uncaughtException", err => {
	console.log(err.name, err.message);
	console.log("UNCAUGHT EXCEPTION! shutting down...");
	process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		connectTimeoutMS: 30000, // Set connection timeout to 30 seconds
		socketTimeoutMS: 45000, // Set socket timeout to 45 seconds
	})
	.then(() => console.log("DB connection successful"))
	.catch(err => {
		console.log("ERROR");
		console.log(err);
	});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, error => {
	if (!error)
		console.log(
			`Server Successfully Running, App is listening on port ${PORT}`
		);
	else console.log("Error occurred, server can't start", error);
});

process.on("unhandledRejection", err => {
	console.log(err.name, err.message);
	console.log("Unhadled rejection! shutting down...");
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", err => {});
