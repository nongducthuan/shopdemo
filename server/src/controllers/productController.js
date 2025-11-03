const { getAllProducts } = require('../models/productModel');

async function getProducts(req, res) {
  try {
    const { category_id } = req.query;
    const products = await getAllProducts(category_id);
    res.json(products);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProducts };
