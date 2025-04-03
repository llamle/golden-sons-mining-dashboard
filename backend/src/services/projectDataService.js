const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Path to the data files
const DATA_DIR = path.join(__dirname, '../../../data/provided');

/**
 * Get list of all available projects
 * @returns {Promise<Array>} Array of project summaries
 */
const listProjects = async () => {
  try {
    // For now, we know we have one main project: Golden Sons - Minas y Cuevas
    const goldenSonsData = await getProjectData('golden-sons-complete-data-march.json');
    
    return [
      {
        id: 'golden-sons',
        name: goldenSonsData.metaData.projectName,
        description: 'Gold mining project with significant upside potential',
        location: 'Honduras, Central America',
        dateUpdated: goldenSonsData.metaData.dataPreparationDate,
        goldPrice: goldenSonsData.metaData.goldPriceAssumptions.financialProjection,
        recoveryRates: goldenSonsData.metaData.recoveryRates,
        mineLife: goldenSonsData.metaData.mineLifeProjection,
        totalGold: goldenSonsData.metaData.totalRecoverableGold,
        valuation: goldenSonsData.metaData.currentValuation
      }
    ];
  } catch (error) {
    logger.error('Error listing projects', { error: error.message });
    throw new Error('Failed to list projects');
  }
};

/**
 * Get project summary information
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project summary data
 */
const getProjectSummary = async (projectId) => {
  try {
    if (projectId === 'golden-sons') {
      const goldenSonsData = await getProjectData('golden-sons-complete-data-march.json');
      
      return {
        id: 'golden-sons',
        name: goldenSonsData.metaData.projectName,
        summary: goldenSonsData.companyDocuments.executiveSummary,
        proposal: goldenSonsData.companyDocuments.proposal,
        metaData: goldenSonsData.metaData
      };
    }
    
    throw new Error(`Project with ID "${projectId}" not found`);
  } catch (error) {
    logger.error(`Error getting project summary for ${projectId}`, { error: error.message });
    throw new Error(`Failed to get project summary for ${projectId}`);
  }
};

/**
 * Get project financial data
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project financial data
 */
const getProjectFinancials = async (projectId) => {
  try {
    if (projectId === 'golden-sons') {
      const goldenSonsData = await getProjectData('golden-sons-complete-data-march.json');
      
      return {
        id: 'golden-sons',
        name: goldenSonsData.metaData.projectName,
        financialData: goldenSonsData.financialData
      };
    }
    
    throw new Error(`Project with ID "${projectId}" not found`);
  } catch (error) {
    logger.error(`Error getting financials for ${projectId}`, { error: error.message });
    throw new Error(`Failed to get financials for ${projectId}`);
  }
};

/**
 * Get project geological data
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project geological data
 */
const getProjectGeologicalData = async (projectId) => {
  try {
    if (projectId === 'golden-sons') {
      // Get data from Vueltas Del Rio geological files
      const geologicalData = await getProjectData('Vueltas_Del_Rio_Main_Geological_Appraisal.json');
      const desktopStudy = await getProjectData('Vueltas_Del_Rio_Desktop_Study_Summary.json');
      
      return {
        id: 'golden-sons',
        geologicalAppraisal: geologicalData.report,
        desktopStudy: desktopStudy
      };
    }
    
    throw new Error(`Project with ID "${projectId}" not found`);
  } catch (error) {
    logger.error(`Error getting geological data for ${projectId}`, { error: error.message });
    throw new Error(`Failed to get geological data for ${projectId}`);
  }
};

/**
 * Get data from a JSON file
 * @param {string} filename - Name of the JSON file
 * @returns {Promise<Object>} Parsed JSON data
 */
const getProjectData = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading project data from ${filename}`, { error: error.message });
    throw new Error(`Failed to read project data from ${filename}`);
  }
};

module.exports = {
  listProjects,
  getProjectSummary,
  getProjectFinancials,
  getProjectGeologicalData,
  getProjectData
};
