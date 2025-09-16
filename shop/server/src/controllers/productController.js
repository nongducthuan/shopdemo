// controllers/productController.js
const pool = require('../db');

async function getProducts(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, name, description, price, image_url, stock FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProducts };
