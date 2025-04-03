const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');

/**
 * Read and parse a JSON file
 * @param {string} filename - The name of the file to read
 * @returns {Promise<Object>} - The parsed JSON data
 */
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, '../../../data/provided', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading file ${filename}: ${error.message}`);
    throw new Error(`Failed to read or parse ${filename}`);
  }
}

/**
 * Get the list of all available projects
 * @returns {Promise<Array>} - The list of available projects
 */
async function listProjects() {
  try {
    return [
      {
        id: 'golden-sons',
        name: 'Golden Sons Mining - Minas y Cuevas Project',
        description: 'Gold mining project with significant upside potential',
        location: 'Honduras, Central America',
        mainDataFile: 'golden-sons-complete-data-march.json',
        supportingFiles: [
          'PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json',
          'Vueltas_Del_Rio_Desktop_Study_Summary.json',
          'Vueltas_Del_Rio_Main_Geological_Appraisal.json'
        ]
      }
    ];
  } catch (error) {
    logger.error(`Error listing projects: ${error.message}`);
    throw new Error('Failed to list projects');
  }
}

/**
 * Get key metrics for Golden Sons project
 * @returns {Promise<Object>} - Key metrics for the project
 */
async function getGoldenSonsKeyMetrics() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Extract key metrics from the metadata
    return {
      projectName: mainData.metaData.projectName,
      dataPreparationDate: mainData.metaData.dataPreparationDate,
      goldPriceAssumptions: {
        executiveSummary: mainData.metaData.goldPriceAssumptions.executiveSummary,
        financialProjection: mainData.metaData.goldPriceAssumptions.financialProjection,
        proposal: mainData.metaData.goldPriceAssumptions.proposal
      },
      recoveryRates: {
        oxide: mainData.metaData.recoveryRates.oxide,
        transition: mainData.metaData.recoveryRates.transition,
        sulfide: mainData.metaData.recoveryRates.sulfide
      },
      mineLifeProjection: mainData.metaData.mineLifeProjection,
      totalRecoverableGold: mainData.metaData.totalRecoverableGold,
      keyEconomicMetrics: {
        postTaxIRR: mainData.metaData.keyEconomicMetrics.postTaxIRR,
        npv5: mainData.metaData.keyEconomicMetrics.npv5,
        paybackPeriod: mainData.metaData.keyEconomicMetrics.paybackPeriod
      },
      currentValuation: mainData.metaData.currentValuation,
      projectedValuationAfterNI43101: mainData.metaData.projectedValuationAfterNI43101
    };
  } catch (error) {
    logger.error(`Error getting Golden Sons key metrics: ${error.message}`);
    throw new Error('Failed to get Golden Sons key metrics');
  }
}

/**
 * Get P&L financials for Golden Sons project
 * @returns {Promise<Object>} - P&L data
 */
async function getGoldenSonsPnL() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Return the full P&L data
    return {
      pnl: mainData.financialData.P&L,
      // You can add additional processing or structure here if needed
    };
  } catch (error) {
    logger.error(`Error getting Golden Sons P&L: ${error.message}`);
    throw new Error('Failed to get Golden Sons P&L');
  }
}

/**
 * Get balance sheet financials for Golden Sons project
 * @returns {Promise<Object>} - Balance sheet data
 */
async function getGoldenSonsBalanceSheet() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Return the full balance sheet data
    return {
      balanceSheet: mainData.financialData.BS,
      // You can add additional processing or structure here if needed
    };
  } catch (error) {
    logger.error(`Error getting Golden Sons balance sheet: ${error.message}`);
    throw new Error('Failed to get Golden Sons balance sheet');
  }
}

/**
 * Get cash flow financials for Golden Sons project
 * @returns {Promise<Object>} - Cash flow data
 */
async function getGoldenSonsCashFlow() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Return the full cash flow data
    return {
      cashFlow: mainData.financialData['Cash Flow'],
      // You can add additional processing or structure here if needed
    };
  } catch (error) {
    logger.error(`Error getting Golden Sons cash flow: ${error.message}`);
    throw new Error('Failed to get Golden Sons cash flow');
  }
}

/**
 * Get production schedule for Golden Sons project
 * @returns {Promise<Object>} - Production schedule data
 */
async function getGoldenSonsProductionSchedule() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Extract production-related items from P&L
    const productionData = mainData.financialData.P&L.filter(item => 
      ['Waste Rock', 'Ore Mined', 'Au grade', 'Stockpile Rehandle', 
       'Total Open Pit Mined', 'Strip Ratio (OP)', 'Processing (Total)', 
       'Au grade', 'Total Recovered Gold'].includes(item.category)
    );
    
    return {
      production: productionData,
      // You can add additional processing or structure here if needed
    };
  } catch (error) {
    logger.error(`Error getting Golden Sons production schedule: ${error.message}`);
    throw new Error('Failed to get Golden Sons production schedule');
  }
}

/**
 * Get executive summary for Golden Sons project
 * @returns {Promise<Object>} - Executive summary data
 */
async function getGoldenSonsExecutiveSummary() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Return the executive summary
    return mainData.companyDocuments.executiveSummary;
  } catch (error) {
    logger.error(`Error getting Golden Sons executive summary: ${error.message}`);
    throw new Error('Failed to get Golden Sons executive summary');
  }
}

/**
 * Get proposal for Golden Sons project
 * @returns {Promise<Object>} - Proposal data
 */
async function getGoldenSonsProposal() {
  try {
    const mainData = await readJsonFile('golden-sons-complete-data-march.json');
    
    // Return the proposal
    return mainData.companyDocuments.proposal;
  } catch (error) {
    logger.error(`Error getting Golden Sons proposal: ${error.message}`);
    throw new Error('Failed to get Golden Sons proposal');
  }
}

/**
 * Get desktop study memo for Golden Sons project
 * @returns {Promise<Object>} - Desktop study memo data
 */
async function getGoldenSonsDesktopStudyMemo() {
  try {
    return await readJsonFile('PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json');
  } catch (error) {
    logger.error(`Error getting Golden Sons desktop study memo: ${error.message}`);
    throw new Error('Failed to get Golden Sons desktop study memo');
  }
}

/**
 * Get geological appraisal for Golden Sons project
 * @returns {Promise<Object>} - Geological appraisal data
 */
async function getGoldenSonsGeologicalAppraisal() {
  try {
    return await readJsonFile('Vueltas_Del_Rio_Main_Geological_Appraisal.json');
  } catch (error) {
    logger.error(`Error getting Golden Sons geological appraisal: ${error.message}`);
    throw new Error('Failed to get Golden Sons geological appraisal');
  }
}

/**
 * Get all financials for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Object>} - All financial data for the project
 */
async function getProjectFinancials(projectId) {
  if (projectId === 'golden-sons') {
    try {
      const pnl = await getGoldenSonsPnL();
      const balanceSheet = await getGoldenSonsBalanceSheet();
      const cashFlow = await getGoldenSonsCashFlow();
      
      return {
        pnl: pnl.pnl,
        balanceSheet: balanceSheet.balanceSheet,
        cashFlow: cashFlow.cashFlow
      };
    } catch (error) {
      logger.error(`Error getting Golden Sons financials: ${error.message}`);
      throw new Error('Failed to get Golden Sons financials');
    }
  } else {
    throw new Error(`Project ${projectId} not found`);
  }
}

/**
 * Get summary for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Object>} - Summary data for the project
 */
async function getProjectSummary(projectId) {
  if (projectId === 'golden-sons') {
    try {
      const keyMetrics = await getGoldenSonsKeyMetrics();
      const executiveSummary = await getGoldenSonsExecutiveSummary();
      
      return {
        keyMetrics,
        executiveSummary
      };
    } catch (error) {
      logger.error(`Error getting Golden Sons summary: ${error.message}`);
      throw new Error('Failed to get Golden Sons summary');
    }
  } else {
    throw new Error(`Project ${projectId} not found`);
  }
}

module.exports = {
  listProjects,
  getProjectSummary,
  getProjectFinancials,
  getGoldenSonsKeyMetrics,
  getGoldenSonsPnL,
  getGoldenSonsBalanceSheet,
  getGoldenSonsCashFlow,
  getGoldenSonsProductionSchedule,
  getGoldenSonsExecutiveSummary,
  getGoldenSonsProposal,
  getGoldenSonsDesktopStudyMemo,
  getGoldenSonsGeologicalAppraisal
};
