const { createOrder, addOrderItems } = require('../models/orderModel');
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

    // 🔹 Kiểm tra dữ liệu cơ bản
    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
      return res.status(400).json({ message: 'Invalid order data: no items' });
    }
    if (totalPrice == null || Number.isNaN(Number(totalPrice))) {
      return res.status(400).json({ message: 'Invalid total price' });
    }

    // 🔹 Kiểm tra user có số điện thoại chưa
    const [userRows] = await conn.query('SELECT phone FROM users WHERE id = ?', [userId]);
    const phone = userRows.length > 0 ? userRows[0].phone : null;

    if (!phone || phone.trim() === '') {
      return res.status(400).json({
        message: 'User chưa có số điện thoại. Vui lòng cập nhật trước khi đặt hàng.'
      });
    }

    // 🔹 Chuẩn hóa item
    const items = itemsRaw.map(it => ({
      product_id: it.product_id ?? it.productId,
      color_id: it.color_id ?? it.colorId ?? null,
      size_id: it.size_id ?? it.sizeId ?? null,
      quantity: Number(it.quantity ?? 1),
      price: Number(it.price ?? 0)
    }));

    // 🔹 Validate item
    for (const it of items) {
      if (!it.product_id || !it.size_id || it.quantity <= 0 || Number.isNaN(it.price)) {
        return res.status(400).json({ message: 'Invalid item in order' });
      }
    }

    // 🔹 Giao dịch tạo đơn
    await conn.beginTransaction();

    const orderId = await createOrder(conn, userId, Number(totalPrice), address, phone);
    await addOrderItems(conn, orderId, items);

    // 🔹 Trừ tồn kho theo size
    for (const it of items) {
      const [result] = await conn.query(
        `UPDATE product_sizes 
         SET stock = stock - ? 
         WHERE id = ? AND stock >= ?`,
        [it.quantity, it.size_id, it.quantity]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Không đủ tồn kho cho size ID ${it.size_id}`);
      }
    }

    // 🔹 Cập nhật tổng stock cho sản phẩm (tổng size)
    await conn.query(`
      UPDATE products p
      SET p.stock = (
        SELECT SUM(ps.stock)
        FROM product_colors pc
        JOIN product_sizes ps ON ps.color_id = pc.id
        WHERE pc.product_id = p.id
      )
    `);

    await conn.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {}
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
        `SELECT 
            oi.id, oi.product_id, oi.color_id, oi.size_id, 
            oi.quantity, oi.price, 
            p.name AS product_name,
            pc.color_name,
            ps.size,
            CONCAT('http://localhost:5000', pc.image_url) AS color_image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         LEFT JOIN product_colors pc ON oi.color_id = pc.id
         LEFT JOIN product_sizes ps ON oi.size_id = ps.id
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
