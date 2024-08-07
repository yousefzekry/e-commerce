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
	.post(
		authController.protect,
		authController.restrictTo("user", "admin"),
		createProduct
	);
router
	.route("/:id")
	.get(getProduct)
	.patch(
		authController.protect,
		authController.restrictTo("user", "admin"),
		updateProduct
	)
	.delete(
		authController.protect,
		authController.restrictTo("user", "admin"),
		deleteProduct
	);

module.exports = router;
