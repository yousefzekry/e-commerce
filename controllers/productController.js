const fs = require("fs");

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/products.json`)
);
exports.getAllProducts = (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
};
exports.getProduct = (req, res) => {
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
};
exports.createProduct = (req, res) => {
  // validation()=>{

  //}
  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body, { 0: "code" });
  products.push(newProduct);
  fs.writeFile(
    `${__dirname}/../dev-data/data/products.json`,
    JSON.stringify(products),
    (err) => {
      if (err) {
        console.error("Error writing file: ", err);
        res.status(500).json({
          status: "error",
          message: "internal server error",
        });
        return;
      }
      res.status(201).json(newProduct);
    }
  );
};
exports.updateProduct = (req, res) => {
  const id = req.params.id * 1;

  const productId = products.findIndex((el) => el.id === id);
  if (!productId) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  const existingProduct = products[productId];
  const updatedProduct = Object.assign({}, existingProduct, req.body, {
    id,
  });
  products[productId] = updatedProduct;

  fs.writeFile(
    `${__dirname}/../dev-data/data/products.json`,
    JSON.stringify(products),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "internal server error",
        });
      }

      res.status(200).json({
        status: "success",
        data: updatedProduct,
      });
    }
  );
};
//delete req.body
exports.deleteProduct = (req, res) => {
  const id = req.params.id * 1;

  const index = products.find((el) => el.id === id);
  if (!index) {
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  products.splice(id, 1);
  fs.writeFile(
    `${__dirname}/../dev-data/data/products.json`,
    JSON.stringify(products),
    (err) => {
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
