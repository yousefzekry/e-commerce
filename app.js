const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

// Set Security http headers
app.use(helmet());
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 10000,
	message: "Too many requests from this IP, please try again in an hour!",
});

// Limit requests from same API
app.use("/api", limiter);

// body parser, reading from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitizaton against noSQL query injection
app.use(mongoSanitize());

//Data sanitize against XSS attacks
app.use(xss());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	next(new errorHandler(`Can't find ${req.originalUrl}, on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
