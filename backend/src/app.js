require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const logger = require('./config/logger');

// Initialize Express
const app = express();

// Set port from environment or default to 3001
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Add security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Custom middleware to log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Import routes (to be implemented)
// const marketDataRoutes = require('./api/marketData');
// const projectsRoutes = require('./api/projects');

// Root route - basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Golden Sons Mining Dashboard API is running!' });
});

// Mount routes (to be implemented)
// app.use('/api/market', marketDataRoutes);
// app.use('/api/projects', projectsRoutes);

// 404 handler
app.use((req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Error processing request: ${err.message}`, { 
    method: req.method, 
    url: req.originalUrl,
    error: err.stack 
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
