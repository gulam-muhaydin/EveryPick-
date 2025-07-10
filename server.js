require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Enhanced mobile detection middleware
app.use((req, res, next) => {
  req.isMobile = /mobile|android|iphone|ipad|phone/i.test(req.headers['user-agent'] || '');
  req.isChromeMobile = /chrome|android/i.test(req.headers['user-agent'] || '');
  next();
});

// Security and compression
app.use(helmet());
app.use(compression({ level: 6 }));

// Configure CORS for mobile compatibility
const allowedOrigins = [
  'https://everypick.online',
  'https://www.everypick.online',
  'https://everypick.vercel.app',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps)
    if (!origin && req.isMobile) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Type'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
}));

// Mobile network optimization
app.use((req, res, next) => {
  if (req.isMobile) {
    req.socket.setTimeout(30000); // 30s timeout for mobile
    res.setHeader('X-Device-Type', 'mobile');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=30');
  }
  next();
});

// Body parsing with mobile-specific limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Order processing endpoints
app.post('/api/orders', (req, res) => {
  try {
    console.log(`Order attempt from ${req.isMobile ? 'mobile' : 'desktop'}:`, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      origin: req.headers['origin']
    });

    const requiredFields = ['name', 'address', 'phone', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missing: missingFields,
        device: req.isMobile ? 'mobile' : 'desktop'
      });
    }

    const orders = readOrders();
    const newOrder = {
      ...req.body,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      device: req.isMobile ? 'mobile' : 'desktop',
      ip: req.ip
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.json({
      success: true,
      orderId: newOrder.id,
      optimizedFor: req.isMobile ? 'mobile' : 'desktop'
    });

  } catch (error) {
    console.error('Order processing error:', error);
    res.status(503).json({
      error: req.isMobile ? 'mobile_connection_error' : 'server_error',
      message: req.isMobile ? 'Network connection unstable' : 'Internal server error',
      retry: req.isMobile
    });
  }
});

// Add other endpoints (GET, PATCH, DELETE) as previously defined...

// Debug endpoint
app.get('/api/connection-test', (req, res) => {
  res.json({
    status: 'success',
    connection: 'active',
    device: req.isMobile ? 'mobile' : 'desktop',
    network: {
      ip: req.ip,
      headers: {
        'user-agent': req.headers['user-agent'],
        'accept': req.headers['accept'],
        'connection': req.headers['connection']
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    device: req.isMobile ? 'mobile' : 'desktop',
    url: req.originalUrl
  });

  res.status(500).json({
    error: req.isMobile ? 'mobile_operation_failed' : 'server_error',
    message: req.isMobile ? 'Please check your connection and try again' : 'Internal server error',
    support: 'support@everypick.online',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Mobile-optimized endpoints ready`);
});

// Helper functions
function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error writing orders:', err);
  }
}