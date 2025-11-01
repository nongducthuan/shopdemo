const pool = require("../db");

// =================== PRODUCTS ===================
async function getAllProducts() {
  const [rows] = await pool.query(`
    SELECT 
      p.*, 
      COALESCE(SUM(ps.stock), 0) AS total_stock
    FROM products p
    LEFT JOIN product_colors pc ON pc.product_id = p.id
    LEFT JOIN product_sizes ps ON ps.color_id = pc.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `);
  return rows;
}

async function createProduct(product) {
  const { name, description, price, image_url, gender, category } = product;
  const [result] = await pool.query(
    "INSERT INTO products (name, description, price, image_url, gender, category) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description || null, price, image_url || null, gender, category]
  );
  return result.insertId;
}

async function updateProduct(id, product) {
  const { name, description, price, image_url, gender, category } = product;
  const [result] = await pool.query(
    "UPDATE products SET name=?, description=?, price=?, image_url=?, gender=?, category=? WHERE id=?",
    [name, description || null, price, image_url || null, gender, category, id]
  );
  return result.affectedRows;
}

async function deleteProduct(id) {
  const [colors] = await pool.query("SELECT id FROM product_colors WHERE product_id=?", [id]);
  for (const color of colors) {
    await pool.query("DELETE FROM product_sizes WHERE color_id=?", [color.id]);
  }
  await pool.query("DELETE FROM product_colors WHERE product_id=?", [id]);
  const [result] = await pool.query("DELETE FROM products WHERE id=?", [id]);
  return result.affectedRows;
}

async function getProductById(id) {
  // Lấy thông tin sản phẩm và tổng stock
  const [products] = await pool.query(`
    SELECT 
      p.*,
      COALESCE(SUM(ps.stock), 0) AS total_stock
    FROM products p
    LEFT JOIN product_colors pc ON pc.product_id = p.id
    LEFT JOIN product_sizes ps ON ps.color_id = pc.id
    WHERE p.id = ?
    GROUP BY p.id
  `, [id]);

  if (!products.length) return null;
  const product = products[0];

  // Lấy màu + size + stock từng màu
  const [colorRows] = await pool.query(`
    SELECT 
      pc.id AS color_id,
      pc.color_name,
      pc.color_code,
      pc.image_url,
      COALESCE(SUM(ps.stock), 0) AS total_stock
    FROM product_colors pc
    LEFT JOIN product_sizes ps ON ps.color_id = pc.id
    WHERE pc.product_id = ?
    GROUP BY pc.id
  `, [id]);

  // Gắn size vào từng màu
  const colors = [];
  for (const color of colorRows) {
    const [sizes] = await pool.query(`
      SELECT 
        id, 
        size, 
        stock 
      FROM product_sizes 
      WHERE color_id = ?
      ORDER BY id
    `, [color.color_id]);

    colors.push({
      id: color.color_id,
      color_name: color.color_name,
      color_code: color.color_code,
      image_url: color.image_url,
      total_stock: color.total_stock,
      sizes,
    });
  }

  // Gắn toàn bộ màu vào sản phẩm
  product.colors = colors;

  return product;
}

// =================== COLORS ===================
async function getColorsByProduct(productId) {
  const [colors] = await pool.query(`
    SELECT 
      pc.*, 
      COALESCE(SUM(ps.stock), 0) AS total_stock
    FROM product_colors pc
    LEFT JOIN product_sizes ps ON ps.color_id = pc.id
    WHERE pc.product_id = ?
    GROUP BY pc.id
  `, [productId]);

  for (const color of colors) {
    const [sizes] = await pool.query("SELECT * FROM product_sizes WHERE color_id=?", [color.id]);
    color.sizes = sizes;
  }

  return colors;
}

async function createColor(productId, color) {
  const { color_name, color_code, image_url } = color;
  const [result] = await pool.query(
    "INSERT INTO product_colors (product_id, color_name, color_code, image_url) VALUES (?, ?, ?, ?)",
    [productId, color_name, color_code, image_url]
  );
  return result.insertId;
}

async function updateColor(colorId, color) {
  const { color_name, color_code, image_url } = color;
  const [result] = await pool.query(
    "UPDATE product_colors SET color_name=?, color_code=?, image_url=? WHERE id=?",
    [color_name, color_code, image_url, colorId]
  );
  return result.affectedRows;
}

async function deleteColor(colorId) {
  await pool.query("DELETE FROM product_sizes WHERE color_id=?", [colorId]);
  const [result] = await pool.query("DELETE FROM product_colors WHERE id=?", [colorId]);
  return result.affectedRows;
}

// =================== SIZES ===================
async function getSizesByColor(colorId) {
  const [sizes] = await pool.query("SELECT * FROM product_sizes WHERE color_id=?", [colorId]);
  return sizes;
}

async function createSize(colorId, size) {
  const { size: sizeName, stock } = size;
  const [result] = await pool.query(
    "INSERT INTO product_sizes (color_id, size, stock) VALUES (?, ?, ?)",
    [colorId, sizeName, stock]
  );
  return result.insertId;
}

async function updateSize(sizeId, size) {
  const { size: sizeName, stock } = size;
  const [result] = await pool.query(
    "UPDATE product_sizes SET size=?, stock=? WHERE id=?",
    [sizeName, stock, sizeId]
  );
  return result.affectedRows;
}

async function deleteSize(sizeId) {
  const [result] = await pool.query("DELETE FROM product_sizes WHERE id=?", [sizeId]);
  return result.affectedRows;
}

// =================== ORDERS ===================
async function getAllOrders() {
  const [orders] = await pool.query(`
    SELECT 
      o.*, 
      u.name as user_name, 
      u.email 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC
  `);

  for (const order of orders) {
    const [items] = await pool.query(`
      SELECT 
        oi.*, 
        p.name as product_name 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE order_id = ?
    `, [order.id]);
    order.items = items;
  }
  return orders;
}

async function updateOrderStatus(orderId, status) {
  const [result] = await pool.query("UPDATE orders SET status=? WHERE id=?", [status, orderId]);
  return result.affectedRows;
}

// =================== BANNERS ===================
async function getAllBanners() {
  const [rows] = await pool.query("SELECT * FROM banners ORDER BY id DESC");
  return rows;
}

async function createBanner(banner) {
  const { image_url, title, subtitle } = banner;
  const [result] = await pool.query(
    "INSERT INTO banners (image_url, title, subtitle) VALUES (?, ?, ?)",
    [image_url, title, subtitle]
  );
  return result.insertId;
}

async function updateBanner(id, banner) {
  const { image_url, title, subtitle } = banner;
  const [result] = await pool.query(
    "UPDATE banners SET image_url=?, title=?, subtitle=? WHERE id=?",
    [image_url, title, subtitle, id]
  );
  return result.affectedRows;
}

async function deleteBanner(id) {
  const [result] = await pool.query("DELETE FROM banners WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getColorsByProduct,
  createColor,
  updateColor,
  deleteColor,
  getSizesByColor,
  createSize,
  updateSize,
  deleteSize,
  getAllOrders,
  updateOrderStatus,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
