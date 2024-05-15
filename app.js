const express = require("express");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
app.use(express.json()); //

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
