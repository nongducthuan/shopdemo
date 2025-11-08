// models/productModel.js
const pool = require('../db');

// ✅ Lấy tất cả sản phẩm (có thể lọc theo category_id)
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

// ✅ Lấy sản phẩm đại diện (sản phẩm đầu tiên trong danh mục)
async function getRepresentativeProduct(category_id) {
  const [rows] = await pool.query(
    `SELECT id, name, image_url 
     FROM products 
     WHERE category_id = ? 
     ORDER BY id ASC 
     LIMIT 1`,
    [category_id]
  );

  return rows[0] || null;
}

// ✅ Lấy danh sách màu và size thật của sản phẩm
async function getProductOptionsById(productId) {
  const [colors] = await pool.query(
    `SELECT id, color_name AS name, color_code, image_url
     FROM product_colors
     WHERE product_id = ?`,
    [productId]
  );

  const [sizes] = await pool.query(
    `SELECT DISTINCT ps.size
     FROM product_sizes ps
     INNER JOIN product_colors pc ON ps.color_id = pc.id
     WHERE pc.product_id = ?`,
    [productId]
  );

  return { sizes, colors };
}

module.exports = { getAllProducts, getRepresentativeProduct, getProductOptionsById };
