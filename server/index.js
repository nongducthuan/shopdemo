require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./src/db');
const productsRouter = require('./src/routes/productRoute');
const authRouter = require('./src/routes/authRoute');
const ordersRouter = require('./src/routes/orderRoute');
const adminRouter = require('./src/routes/adminRoute');
const categoryRouter = require('./src/routes/categoryRoute');

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ✅ Serve thư mục public
app.use('/public', express.static(path.join(__dirname, 'public')));

// ✅ Route chính
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.use('/admin', adminRouter);
app.use('/categories', categoryRouter); 

// ✅ Public route cho banners (frontend dùng)
app.get('/banners', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banners ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách banner' });
  }
});

// ✅ Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
