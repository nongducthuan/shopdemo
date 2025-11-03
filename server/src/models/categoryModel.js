const pool = require('../db');

async function getAllCategories() {
  const [rows] = await pool.query(`
    SELECT c.id, c.name, c.parent_id, p.name AS parent_name
    FROM categories c
    LEFT JOIN categories p ON c.parent_id = p.id
    ORDER BY c.parent_id, c.id
  `);
  return rows;
}

async function createCategory({ name, parent_id = null }) {
  const [result] = await pool.query(
    "INSERT INTO categories (name, parent_id) VALUES (?, ?)",
    [name, parent_id]
  );
  return result.insertId;
}

async function updateCategory(id, { name, parent_id = null }) {
  const [result] = await pool.query(
    "UPDATE categories SET name=?, parent_id=? WHERE id=?",
    [name, parent_id, id]
  );
  return result.affectedRows;
}

async function deleteCategory(id) {
  await pool.query("UPDATE categories SET parent_id=NULL WHERE parent_id=?", [id]);
  const [result] = await pool.query("DELETE FROM categories WHERE id=?", [id]);
  return result.affectedRows;
}

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
