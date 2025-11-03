// models/productModel.js
const pool = require('../db');

async function getAllProducts(category_id = null) {
  let sql = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.image_url, 
      p.stock, 
      p.sale_percent, 
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  const params = [];

  if (category_id) {
    sql += " WHERE p.category_id = ?";
    params.push(category_id);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { getAllProducts };
