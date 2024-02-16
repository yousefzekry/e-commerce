const fs = require("fs");
const express = require("express");
const { toUSVString } = require("util");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("get request working");
});

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/products.json`)
);

app.get("/api/v1/products", (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

app.post("/api/v1/products", (req, res) => {
  // console.log(req.body);
  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body);
  products.push(newProduct);
  fs.writeFile(
    `${__dirname}/dev-data/data/products.json`,
    JSON.stringify(products),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          product: newProduct,
        },
      });
    }
  );
});
const port = 5000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
