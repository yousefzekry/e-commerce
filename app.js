const express = require("express");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const globalErrorHandler = require("./controllers/errorController");
const app = express();
app.use(express.json()); //

app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	next(new errorHandler(`Can't find ${req.originalUrl}, on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
