// Parts Inventory Controller
const db = require('../src/db');

// Get all parts
exports.getAllParts = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM parts_inventory');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Add a new part
exports.addPart = async (req, res) => {
let { name, category, stock, status } = req.body;
// Category mapping: if category is a number, convert to name
const categoryMap = {
  1: 'Engine',
  2: 'Brakes',
  3: 'Electrical',
  4: 'AC',
  5: 'Body',
  6: 'Suspension',
  7: 'Tires',
  8: 'Other'
};
if (typeof category === 'number' || !isNaN(category)) {
  category = categoryMap[category] || 'Other';
}
// Calculate status if not provided
if (!status) {
  stock = Number(stock);
  if (stock === 0) status = 'Out of Stock';
  else if (stock <= 5) status = 'Low Stock';
  else status = 'In Stock';
}
try {
  const [result] = await db.query(
    'INSERT INTO parts_inventory (name, category, stock, status) VALUES (?, ?, ?, ?)',
    [name, category, stock, status]
  );
  res.json({ id: result.insertId, name, category, stock, status });
} catch (err) {
  res.status(500).json({ error: err });
}
};

// Edit a part
exports.editPart = async (req, res) => {
const { id } = req.params;
let { name, category, stock, status } = req.body;
// Category mapping: if category is a number, convert to name
const categoryMap = {
  1: 'Engine',
  2: 'Brakes',
  3: 'Electrical',
  4: 'AC',
  5: 'Body',
  6: 'Suspension',
  7: 'Tires',
  8: 'Other'
};
if (typeof category === 'number' || !isNaN(category)) {
  category = categoryMap[category] || 'Other';
}
try {
  await db.query(
    'UPDATE parts_inventory SET name=?, category=?, stock=?, status=? WHERE id=?',
    [name, category, stock, status, id]
  );
  res.json({ id, name, category, stock, status });
} catch (err) {
  res.status(500).json({ error: err });
}
};

// Delete a part
exports.deletePart = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM parts_inventory WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
