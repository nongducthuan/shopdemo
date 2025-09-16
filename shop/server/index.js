const pool = require('./src/db');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const productsRouter = require('./src/routes/products');
const authRouter = require('./src/routes/auth');
const ordersRouter = require('./src/routes/orders');
const adminRouter = require('./src/routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Chạy file schema.sql khi server start
(async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    const conn = await pool.getConnection();
    await conn.query(schema);
    conn.release();
    console.log("✅ Database schema applied successfully!");
  } catch (err) {
    console.error("❌ Error applying schema:", err);
  }
})();

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/admin', adminRouter);

console.log("ENV:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  db: process.env.DB_NAME
});

// Serve frontend build
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnamePath, "client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
