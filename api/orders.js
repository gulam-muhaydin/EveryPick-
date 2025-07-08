const fs = require('fs');
const path = require('path');

// Path to the orders.json file
const ORDERS_FILE = path.join(__dirname, '../backend/orders.json');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let order;
  try {
    order = req.body;
    if (!order || !order.customerName || !order.customerPhone || !order.customerAddress) {
      res.status(400).json({ error: 'Invalid order data' });
      return;
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  // Read existing orders
  let orders = [];
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const fileData = fs.readFileSync(ORDERS_FILE, 'utf8');
      orders = fileData ? JSON.parse(fileData) : [];
    }
  } catch (err) {
    // If file read fails, treat as empty
    orders = [];
  }

  // Add new order
  orders.push({ ...order, createdAt: new Date().toISOString() });

  // Write back to file
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order' });
  }
};
