// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getRepresentative,
  getProducts,
  getProductOptions,
  getProduct,
} = require("../controllers/productController");
const { getProductDetail } = require("../controllers/productDetailController");

// ✅ Lấy sản phẩm đại diện của danh mục
router.get("/representative", getRepresentative);

// ✅ Lấy danh sách sản phẩm
router.get("/", getProducts);

// ✅ Lấy danh sách màu và size thật
router.get("/:id/options", getProductOptions);

// ✅ Lấy chi tiết sản phẩm
router.get("/:id", getProductDetail);

router.get("/:id/detail", getProduct);

module.exports = router;
