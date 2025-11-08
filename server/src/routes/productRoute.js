// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getRepresentative, getProducts, getProductOptions } = require('../controllers/productController');
const { getProductDetail } = require('../controllers/productDetailController');

// ✅ Lấy sản phẩm đại diện của danh mục
router.get('/representative', getRepresentative);

// ✅ Lấy danh sách sản phẩm
router.get('/', getProducts);

// ✅ Lấy chi tiết sản phẩm
router.get('/:id', getProductDetail);

// ✅ Lấy danh sách màu và size thật
router.get('/:id/options', getProductOptions);

module.exports = router;
