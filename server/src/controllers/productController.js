// controllers/productController.js
const {
  getAllProducts,
  getRepresentativeProduct,
  getProductOptionsById,
  getProductById,
} = require("../models/productModel");

// ✅ Lấy sản phẩm đại diện
async function getRepresentative(req, res) {
  const { category_id } = req.query;
  if (!category_id) {
    return res.status(400).json({ message: "Thiếu category_id" });
  }

  try {
    const product = await getRepresentativeProduct(category_id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Không có sản phẩm đại diện cho danh mục này" });
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm đại diện:", err);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm đại diện" });
  }
}

// ✅ Lấy tất cả sản phẩm (hoặc theo category_id)
async function getProducts(req, res) {
  const { category_id, page = 1, limit = 8 } = req.query;

  try {
    const products = await getAllProducts(category_id);
    const total = products.length; // tổng sản phẩm (nếu chưa phân trang ở model)
    const totalPages = Math.ceil(total / limit);
    const pageNum = Math.max(1, Number(page));

    // Lấy sản phẩm của trang hiện tại (nếu phân trang ở frontend)
    const start = (pageNum - 1) * limit;
    const end = start + Number(limit);
    const data = products.slice(start, end);

    res.json({
      data,
      total,
      totalPages,
      page: pageNum
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Lấy danh sách size và màu thật của sản phẩm
async function getProductOptions(req, res) {
  const productId = req.params.id;

  try {
    const options = await getProductOptionsById(productId);
    res.json(options);
  } catch (err) {
    console.error("❌ Lỗi khi lấy size/màu:", err);
    res.status(500).json({ message: "Lỗi server khi lấy size và màu" });
  }
}

async function getProduct(req, res) {
  const id = req.params.id;

  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ message: "Server error khi lấy sản phẩm" });
  }
}

module.exports = { getRepresentative, getProducts, getProductOptions, getProduct };
