const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join('/tmp', 'orders.json'); // Use /tmp for serverless

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    if (!fs.existsSync(ORDERS_FILE)) return res.status(200).json([]);
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    try {
      return res.status(200).json(JSON.parse(data));
    } catch {
      return res.status(200).json([]);
    }
  } else if (req.method === 'POST') {
    const { name, phone, address, productName, quantity, total, paymentMethod } = req.body;
    if (!name || !address || !phone || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let orders = [];
    if (fs.existsSync(ORDERS_FILE)) {
      orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    }
    const order = {
      id: Date.now(),
      name,
      phone,
      address,
      productName,
      quantity,
      total,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return res.status(200).json({ success: true, order });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};