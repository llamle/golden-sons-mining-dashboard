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

// Import routes (to be implemented)
// const marketDataRoutes = require('./api/marketData');
// const projectsRoutes = require('./api/projects');

// Root route - basic health check
app.get('/', (req, res) => {
  logger.info('Health check endpoint accessed');
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
    error: err.stack,
    path: req.path,
    method: req.method 
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Export for testing
