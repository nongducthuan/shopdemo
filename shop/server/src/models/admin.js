const pool = require('../db');

// --- Sản phẩm ---
async function getAllProducts() {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
}

async function createProduct(product) {
  const { name, description, price, image_url, stock } = product;
  const [result] = await pool.query(
    'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
    [name, description || null, price, image_url || null, stock || 0]
  );
  return result.insertId;
}

async function updateProduct(id, product) {
  const { name, description, price, image_url, stock } = product;
  const [result] = await pool.query(
    'UPDATE products SET name=?, description=?, price=?, image_url=?, stock=? WHERE id=?',
    [name, description || null, price, image_url || null, stock || 0, id]
  );
  return result.affectedRows;
}

async function deleteProduct(id) {
  const [result] = await pool.query('DELETE FROM products WHERE id=?', [id]);
  return result.affectedRows;
}

// --- Đơn hàng ---
async function getAllOrders() {
  const [orders] = await pool.query(
    `SELECT o.*, u.name as user_name, u.email 
     FROM orders o 
     JOIN users u ON o.user_id = u.id 
     ORDER BY o.created_at DESC`
  );

  for (const order of orders) {
    const [items] = await pool.query(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE order_id = ?`,
      [order.id]
    );
    order.items = items;
  }

  return orders;
}

async function updateOrderStatus(orderId, status) {
  const [result] = await pool.query(
    'UPDATE orders SET status=? WHERE id=?',
    [status, orderId]
  );
  return result.affectedRows;
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
};
