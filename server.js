const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
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
app.listen(PORT, error => {
	if (!error)
		console.log(
			`Server Successfully Running, App is listening on port ${PORT}`
		);
	else console.log("Error occurred, server can't start", error);
});
