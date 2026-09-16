const express = require('express');
const cors = require('cors');
const mapRoutes = require('./routes/mapRoutes');
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const adminAboutRoutes = require('./routes/adminAboutRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const path = require('path');
const fs = require('fs');

// Attempt to load .env from project root if available
const rootEnvPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(rootEnvPath);
  } catch (envErr) {
    console.warn('[Server] Notice: .env file found but could not be parsed:', envErr.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Permitted origins for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

// Configure CORS for frontend requests (avoiding wildcard * with credentials)
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, origin);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Impact Bridge API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Map routes
app.use('/api/map', mapRoutes);

// Serve static public assets (images, icons)
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

// Authentication routes
app.use('/api/auth', authRoutes);

// About page public routes
app.use('/api/about', aboutRoutes);

// About page admin routes
app.use('/api/admin/about', adminAboutRoutes);

// Newsletter subscription routes
app.use('/api/newsletter', newsletterRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  // Handle invalid/malformed JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed or invalid JSON payload received.'
    });
  }

  console.error('[Server Error]', err.stack || err.message);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : err.message
  });
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 Impact Bridge Backend Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🗺️ Nearby NGOs: http://localhost:${PORT}/api/map/nearby-ngos`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===========================================`);
  });
}

module.exports = app;
