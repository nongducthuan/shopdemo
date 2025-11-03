const express = require("express");
const router = express.Router();
const db = require("../db");
const { getProducts } = require("../controllers/productController");
const { getProductDetail } = require("../controllers/productDetailController");

router.get("/representative", async (req, res) => {
  const categoryId = req.query.category_id;
  if (!categoryId) return res.status(400).json({ error: "Missing category_id" });

  try {
    const [rows] = await db.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = ? 
       ORDER BY id ASC 
       LIMIT 1`,
      [categoryId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "No product found" });

    res.json(rows[0]); // trả về JSON của 1 sản phẩm đại diện
  } catch (err) {
    console.error("❌ Lỗi fetch ảnh category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Lấy danh sách sản phẩm
router.get("/", getProducts);

// ✅ Lấy chi tiết sản phẩm
router.get("/:id", getProductDetail);

// ✅ Lấy danh sách màu và size thật từ database
router.get("/:id/options", async (req, res) => {
  const productId = req.params.id;

  try {
    // 🔹 Lấy danh sách màu
    const [colors] = await db.query(
      `SELECT id, color_name AS name, color_code, image_url
       FROM product_colors
       WHERE product_id = ?`,
      [productId]
    );

    // 🔹 Lấy danh sách size thật dựa trên product_id
    const [sizes] = await db.query(
      `SELECT DISTINCT ps.size
       FROM product_sizes ps
       INNER JOIN product_colors pc ON ps.color_id = pc.id
       WHERE pc.product_id = ?`,
      [productId]
    );

    res.json({ sizes, colors });
  } catch (err) {
    console.error("❌ Lỗi khi lấy size/màu:", err);
    res.status(500).json({ message: "Lỗi server khi lấy size và màu" });
  }
});

module.exports = router;
