const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// Import services (to be fully implemented)
const dataFetcher = require('../services/dataFetcher');
const dataProcessor = require('../services/dataProcessor');

/**
 * @route   GET /api/market/spot
 * @desc    Get current spot price for gold
 * @access  Public
 */
router.get('/spot', async (req, res) => {
  try {
    const spotPrice = await dataFetcher.getLiveGoldPrice();
    logger.info('Fetched spot price successfully');
    res.json(spotPrice);
  } catch (error) {
    logger.error(`Error fetching spot price: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch spot price' });
  }
});

/**
 * @route   GET /api/market/historical
 * @desc    Get historical price data
 * @access  Public
 * @query   {string} range - Time range (1d, 1w, 1m, 3m, 6m, 1y, 5y)
 * @query   {string} interval - Data point interval (1h, 4h, 1d, 1w)
 */
router.get('/historical', async (req, res) => {
  try {
    const { range = '1m', interval = '1d' } = req.query;
    const historicalData = await dataFetcher.getHistoricalData(range, interval);
    logger.info(`Fetched historical data for range: ${range}, interval: ${interval}`);
    res.json(historicalData);
  } catch (error) {
    logger.error(`Error fetching historical data: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

/**
 * @route   GET /api/market/metrics
 * @desc    Get calculated market metrics (SMA, EMA, etc.)
 * @access  Public
 * @query   {string} metric - Metric type (sma, ema, etc.)
 * @query   {number} period - Period for calculation
 */
router.get('/metrics', async (req, res) => {
  try {
    const { metric = 'sma', period = 20 } = req.query;
    const range = '1y';
    const interval = '1d';
    
    // Get historical data first
    const historicalData = await dataFetcher.getHistoricalData(range, interval);
    
    // Calculate requested metric
    let result;
    switch (metric.toLowerCase()) {
      case 'sma':
        result = dataProcessor.calculateSMA(historicalData, parseInt(period));
        break;
      case 'ema':
        result = dataProcessor.calculateEMA(historicalData, parseInt(period));
        break;
      default:
        return res.status(400).json({ error: `Unsupported metric: ${metric}` });
    }
    
    logger.info(`Calculated ${metric.toUpperCase()} for period: ${period}`);
    res.json(result);
  } catch (error) {
    logger.error(`Error calculating market metrics: ${error.message}`);
    res.status(500).json({ error: 'Failed to calculate market metrics' });
  }
});

module.exports = router;
