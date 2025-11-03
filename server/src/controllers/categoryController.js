const categoryModel = require('../models/categoryModel.js');

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh mục' });
  }
}

async function createCategory(req, res) {
  try {
    const id = await categoryModel.createCategory(req.body);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm danh mục' });
  }
}

async function updateCategory(req, res) {
  try {
    const rows = await categoryModel.updateCategory(req.params.id, req.body);
    res.json({ affected: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục' });
  }
}

async function deleteCategory(req, res) {
  try {
    const rows = await categoryModel.deleteCategory(req.params.id);
    res.json({ affected: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa danh mục' });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
