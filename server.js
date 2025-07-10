// server.js - Updated for everypick.online
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Configured for everypick.online with mobile support
const allowedOrigins = [
  'https://everypick.online',
  'https://www.everypick.online',
  'http://localhost:3000',
  'https://everypick.vercel.app' // If using Vercel
];

// Enhanced CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow mobile apps or direct API calls
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Production - strict origin checking
    if (process.env.NODE_ENV === 'production' && origin && !allowedOrigins.includes(origin)) {
      console.warn('Blocked CORS request from:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Mobile-specific middleware
app.use((req, res, next) => {
  // Identify mobile devices
  req.isMobile = /mobile|android|iphone|ipad|phone/i.test(req.headers['user-agent'] || false);
  
  // Set headers for Worker App compatibility
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Device-Type', req.isMobile ? 'mobile' : 'desktop');
  next();
});

// Increased timeout for mobile networks
app.use((req, res, next) => {
  req.setTimeout(req.isMobile ? 20000 : 10000, () => {
    console.log(`Timeout from ${req.isMobile ? 'mobile' : 'desktop'}:`, req.url);
  });
  next();
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Order processing with mobile logging
app.post('/api/orders', (req, res) => {
  const clientInfo = {
    device: req.isMobile ? 'mobile' : 'desktop',
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress
  };

  console.log('New order attempt from:', clientInfo);

  try {
    const requiredFields = ['name', 'address', 'phone', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.warn('Missing fields:', missingFields, 'from', clientInfo);
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missing: missingFields,
        device: clientInfo.device
      });
    }

    const orders = readOrders();
    const newOrder = {
      ...req.body,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      device: clientInfo.device,
      ipAddress: clientInfo.ip
    };

    orders.push(newOrder);
    writeOrders(orders);
    
    console.log('Order successfully placed:', { id: newOrder.id, device: clientInfo.device });
    res.json({ success: true, orderId: newOrder.id });
    
  } catch (error) {
    console.error('Order processing failed:', error, clientInfo);
    res.status(500).json({
      success: false,
      error: 'Order processing failed',
      device: clientInfo.device,
      message: error.message
    });
  }
});

// [Keep all your other existing endpoints...]

// Enhanced error handling
app.use((err, req, res, next) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    device: req.isMobile ? 'mobile' : 'desktop',
    url: req.originalUrl,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  console.error('Server Error:', errorInfo);
  
  res.status(500).json({
    error: 'Internal server error',
    device: errorInfo.device,
    timestamp: errorInfo.timestamp
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
});

// [Keep your existing helper functions readOrders() and writeOrders()]