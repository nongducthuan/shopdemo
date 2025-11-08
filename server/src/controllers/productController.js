// controllers/productController.js
const { getAllProducts, getRepresentativeProduct, getProductOptionsById } = require('../models/productModel');

// ✅ Lấy sản phẩm đại diện
async function getRepresentative(req, res) {
  const { category_id } = req.query;
  if (!category_id) {
    return res.status(400).json({ message: 'Thiếu category_id' });
  }

  try {
    const product = await getRepresentativeProduct(category_id);
    if (!product) {
      return res.status(404).json({ message: 'Không có sản phẩm đại diện cho danh mục này' });
    }
    res.json(product);
  } catch (err) {
    console.error('❌ Lỗi khi lấy sản phẩm đại diện:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm đại diện' });
  }
}

// ✅ Lấy tất cả sản phẩm (hoặc theo category_id)
async function getProducts(req, res) {
  const { category_id } = req.query;

  try {
    const products = await getAllProducts(category_id);
    res.json(products);
  } catch (err) {
    console.error('❌ Lỗi khi lấy sản phẩm:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ✅ Lấy danh sách size và màu thật của sản phẩm
async function getProductOptions(req, res) {
  const productId = req.params.id;

  try {
    const options = await getProductOptionsById(productId);
    res.json(options);
  } catch (err) {
    console.error('❌ Lỗi khi lấy size/màu:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy size và màu' });
  }
}

module.exports = { getRepresentative, getProducts, getProductOptions };
