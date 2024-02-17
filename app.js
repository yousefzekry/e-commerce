const fs = require("fs");
const express = require("express");

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
app.get("/api/v1/products/:id", (req, res) => {
  console.log(req.params);
  //storing string id into variable id and converting it into number
  const id = req.params.id * 1;
  /*product equals to searching in the products to find 
  a product with id that matches the product requested*/
  const product = products.find((el) => el.id === id);

  /*try to find the id given and if there is no id send an error message */

  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
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

app.patch("/api/v1/products/:id", (req, res) => {
  const id = req.params.id * 1;

  const product = products.find((el) => el.id === id);
  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  res.status(200).json({
    status: "success",
    data: { product: "<product updated here...." },
  });
});

app.delete("/api/v1/products/:id", (req, res) => {
  const id = req.params.id * 1;

  const product = products.find((el) => el.id === id);
  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
