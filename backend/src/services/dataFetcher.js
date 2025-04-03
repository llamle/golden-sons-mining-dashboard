/**
 * Data Fetcher Service
 * Responsible for external API calls to fetch market and financial data
 */
const logger = require('../config/logger');

/**
 * Get the current live gold price
 * @returns {Promise<Object>} The current gold price data
 */
async function getLiveGoldPrice() {
  // This is a placeholder implementation
  // In production, you would call an external API for real-time prices
  // e.g., https://www.goldapi.io/ or similar
  
  logger.info('Fetching live gold price');
  
  // For now, we're returning mock data
  const mockResponse = {
    timestamp: Date.now(),
    currency: 'USD',
    price: 3100.42, // Mock price based on the data we have ($3,100/oz)
    change: 12.34,
    change_percent: 0.4,
    source: 'Mock Data (Development)'
  };
  
  // Add some random variation to simulate live data
  mockResponse.price += (Math.random() * 20 - 10);
  
  return mockResponse;
}

/**
 * Get historical price data for gold
 * @param {string} range - Time range (1d, 1w, 1m, 3m, 6m, 1y, 5y)
 * @param {string} interval - Data point interval (1h, 4h, 1d, 1w)
 * @returns {Promise<Array>} Historical price data
 */
async function getHistoricalData(range = '1m', interval = '1d') {
  logger.info(`Fetching historical data for range: ${range}, interval: ${interval}`);
  
  // Define time ranges in milliseconds
  const rangeMappings = {
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1m': 30 * 24 * 60 * 60 * 1000,
    '3m': 90 * 24 * 60 * 60 * 1000,
    '6m': 180 * 24 * 60 * 60 * 1000,
    '1y': 365 * 24 * 60 * 60 * 1000,
    '5y': 5 * 365 * 24 * 60 * 60 * 1000
  };
  
  // Define interval in milliseconds
  const intervalMappings = {
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000
  };
  
  const rangeMs = rangeMappings[range] || rangeMappings['1m'];
  const intervalMs = intervalMappings[interval] || intervalMappings['1d'];
  
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - rangeMs);
  
  // Calculate number of intervals
  const numIntervals = Math.ceil(rangeMs / intervalMs);
  
  // Generate mock historical data
  const historicalData = [];
  
  // Base price around $3100
  let basePrice = 3100;
  
  // Generate data points
  for (let i = 0; i < numIntervals; i++) {
    const timestamp = new Date(startDate.getTime() + i * intervalMs);
    
    // Add some price fluctuation (more variation for longer ranges)
    const variation = range.includes('y') ? 500 : (range.includes('m') ? 200 : 50);
    const randomChange = (Math.random() * 2 - 1) * variation * (intervalMs / rangeMappings['1m']);
    
    // Generate OHLC data with some variation
    const open = basePrice + randomChange;
    const high = open + Math.random() * 20;
    const low = open - Math.random() * 20;
    const close = (open + high + low) / 3 + (Math.random() * 10 - 5);
    
    // Generate volume data (in ounces)
    const volume = Math.floor(Math.random() * 100000) + 50000;
    
    historicalData.push({
      timestamp: timestamp.toISOString(),
      open,
      high,
      low,
      close,
      volume
    });
    
    // Use close as the base for next interval
    basePrice = close;
  }
  
  return historicalData;
}

// Export the functions
module.exports = {
  getLiveGoldPrice,
  getHistoricalData
};
