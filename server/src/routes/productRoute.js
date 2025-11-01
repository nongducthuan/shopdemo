const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const { getProductDetail } = require('../controllers/productDetailController');

// Lấy danh sách sản phẩm
router.get('/', getProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductDetail);

module.exports = router;
