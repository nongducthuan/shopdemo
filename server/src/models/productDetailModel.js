// models/productDetailModel.js
const pool = require('../db');

/**
 * Lấy chi tiết sản phẩm bao gồm:
 * - Thông tin sản phẩm chính
 * - Danh sách màu (mỗi màu có ảnh riêng)
 * - Danh sách size tương ứng cho từng màu
 */
async function getProductDetails(productId) {
  // Lấy thông tin sản phẩm chính
  const [productRows] = await pool.query(
    'SELECT id, name, description, price, sale_percent, image_url, stock, gender, category FROM products WHERE id = ?',
    [productId]
  );

  if (productRows.length === 0) return null; // Không tìm thấy sản phẩm

  const product = productRows[0];

  // Lấy danh sách màu của sản phẩm
  const [colorRows] = await pool.query(
    'SELECT id AS color_id, color_name, color_code, image_url FROM product_colors WHERE product_id = ?',
    [productId]
  );

  // Với mỗi màu, lấy danh sách size tương ứng
  for (const color of colorRows) {
    const [sizeRows] = await pool.query(
      'SELECT id AS size_id, size AS size, stock FROM product_sizes WHERE color_id = ?',
      [color.color_id]
    );
    color.sizes = sizeRows;
  }

  // Trả về toàn bộ thông tin
  return {
    ...product,
    colors: colorRows,
  };
}

module.exports = { getProductDetails };
