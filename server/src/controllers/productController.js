// controllers/productController.js
const { getAllProducts } = require('../models/productModel');

async function getProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProducts };
