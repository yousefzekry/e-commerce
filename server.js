const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {})
	.then(() => console.log("DB connection successful"))
	.catch(err => console.log("ERROR"));
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, error => {
	if (!error)
		console.log(
			`Server Successfully Running, App is listening on port ${PORT}`
		);
	else console.log("Error occurred, server can't start", error);
});
