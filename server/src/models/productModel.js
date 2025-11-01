// models/productModel.js
const pool = require('../db');

async function getAllProducts() {
  const [rows] = await pool.query(
    'SELECT id, name, description, price, image_url, stock, gender, category FROM products'
  );
  return rows;
}

module.exports = { getAllProducts };
