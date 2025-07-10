// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

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
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Helper to write orders
function writeOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Endpoint to receive new orders
app.post('/api/orders', (req, res) => {
    const order = req.body;
    if (!order.name || !order.address || !order.phone || !order.paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const orders = readOrders();
    order.id = Date.now();
    order.status = 'pending';
    order.createdAt = new Date().toISOString();
    orders.push(order);
    writeOrders(orders);
    res.json({ success: true, order });
});

// Endpoint to get all orders
app.get('/api/orders', (req, res) => {
    const orders = readOrders();
    // Ensure all fields are present for admin.js
    const formatted = orders.map(order => ({
        id: order.id,
        name: order.name,
        phone: order.phone,
        address: order.address,
        productName: order.productName,
        quantity: order.quantity,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status || 'pending',
        createdAt: order.createdAt || null
    }));
    res.json(formatted);
});

// PATCH endpoint to update order status
app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    let orders = readOrders();
    let found = false;
    orders = orders.map(order => {
        if (order.id == id) {
            found = true;
            return { ...order, status };
        }
        return order;
    });
    if (!found) return res.status(404).json({ error: 'Order not found' });
    writeOrders(orders);
    res.json({ success: true });
});

// DELETE endpoint to delete an order by id
app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    let orders = readOrders();
    const initialLength = orders.length;
    orders = orders.filter(order => order.id != id);
    if (orders.length === initialLength) {
        return res.status(404).json({ error: 'Order not found' });
    }
    writeOrders(orders);
    res.json({ success: true });
});

// Endpoint to get order stats (today, week, month)
app.get('/api/orders/stats', (req, res) => {
    const orders = readOrders();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); // Sunday as start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let today = 0, week = 0, month = 0;
    for (const order of orders) {
        const created = order.createdAt ? new Date(order.createdAt) : null;
        if (!created) continue;
        if (created >= startOfToday) today++;
        if (created >= startOfWeek) week++;
        if (created >= startOfMonth) month++;
    }
    res.json({ today, week, month });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
