const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read orders
function readOrders() {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
  try {
    return JSON.parse(data) || [];
  } catch (e) {
    return [];
  }
}

// Helper to write orders
function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Get all orders
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

// Add a new order
app.post('/api/orders', (req, res) => {
  const { customerName, customerAddress, customerPhone, items, total, status } = req.body;
  if (!customerName || !items || !Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'Invalid order data.' });
  }
  const orders = readOrders();
  const newOrder = {
    id: Date.now(),
    customerName,
    customerAddress: customerAddress || '',
    customerPhone: customerPhone || '',
    items,
    total,
    status: status || 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  writeOrders(orders);
  res.status(201).json(newOrder);
});

// Get a single order by ID
app.get('/api/orders/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

// Update order status
app.patch('/api/orders/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (req.body.status) order.status = req.body.status;
  writeOrders(orders);
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`Order tracker backend running on http://localhost:${PORT}`);
});
