// controllers/orderController.js
const { createOrder, addOrderItems } = require('../models/order');
const pool = require('../db');

async function createOrderController(req, res) {
  const conn = await pool.getConnection();
  try {
    const raw = req.body || {};
    const itemsRaw = raw.items || [];
    const totalPrice = raw.total_price ?? raw.totalPrice;
    const address = raw.address ?? '';
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
      return res.status(400).json({ message: 'Invalid order data: no items' });
    }
    if (totalPrice == null || Number.isNaN(Number(totalPrice))) {
      return res.status(400).json({ message: 'Invalid total price' });
    }
    const items = itemsRaw.map(it => ({
      product_id: it.product_id ?? it.productId,
      quantity: Number(it.quantity ?? 1),
      price: Number(it.price ?? 0),
    }));
    for (const it of items) {
      if (!it.product_id || it.quantity <= 0 || Number.isNaN(it.price)) {
        return res.status(400).json({ message: 'Invalid item in order' });
      }
    }
    await conn.beginTransaction();
    const orderId = await createOrder(conn, userId, Number(totalPrice), address);
    await addOrderItems(conn, orderId, items);
    for (const it of items) {
      const [result] = await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [it.quantity, it.product_id, it.quantity]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Không đủ tồn kho cho sản phẩm ID ${it.product_id}`);
      }
    }
    await conn.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    await conn.rollback();
    console.error('Order creation failed:', err);
    if (err.message && err.message.startsWith('Không đủ tồn kho')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
}

async function getOrders(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name AS product_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    console.error('Get orders failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createOrderController, getOrders };
