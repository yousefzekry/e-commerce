const express = require("express");
const authController = require("./../controllers/authController");
const {
	getAllProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	aliasTopProducts,
} = require("../controllers/productController");

const router = express.Router();
router.route("/top-5-products").get(aliasTopProducts, getAllProducts);
router
	.route("/")
	.get(authController.protect, getAllProducts)
	.post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
