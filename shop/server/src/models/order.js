// models/order.js
const pool = require('../db');

/**
@param {object} conn 
 */
async function createOrder(conn, userId, totalPrice, address) {
  const [result] = await conn.query(
    'INSERT INTO orders (user_id, total_price, address, status, created_at) VALUES (?, ?, ?, ?, NOW())',
    [userId, totalPrice, address, 'pending']
  );
  return result.insertId;
}

async function addOrderItems(conn, orderId, items) {
  const values = items.map(i => {
    const productId = i.product_id ?? i.productId;
    const qty = Number(i.quantity ?? 1);
    const price = Number(i.price ?? 0);
    return [orderId, productId, qty, price];
  }).filter(v => v[0] && v[1] != null);

  if (values.length === 0) return;
  const sql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
  await conn.query(sql, [values]);
}

module.exports = { createOrder, addOrderItems };
