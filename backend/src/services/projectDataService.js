const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');

// Path to the provided data directory
const DATA_DIR = path.join(__dirname, '../../../data/provided');

/**
 * Get a list of all available projects
 * @returns {Promise<Array>} List of projects with basic metadata
 */
async function listProjects() {
  try {
    // This is a simplified version - in a real app we would scan the directory
    // For now, we'll return hardcoded info based on our knowledge of the files
    return [
      {
        id: 'golden-sons',
        name: 'Golden Sons Mining - Minas y Cuevas Project',
        description: 'Primary gold mining project with comprehensive financial data',
        dataFile: 'golden-sons-complete-data-march.json'
      },
      {
        id: 'vueltas-del-rio',
        name: 'Vueltas Del Rio Project',
        description: 'Desktop study and evaluation of gold project in Honduras',
        dataFiles: [
          'PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json',
          'Vueltas_Del_Rio_Desktop_Study_Summary.json',
          'Vueltas_Del_Rio_Main_Geological_Appraisal.json'
        ]
      }
    ];
  } catch (error) {
    logger.error('Error listing projects', { error });
    throw new Error('Failed to list projects');
  }
}

/**
 * Get summary information for a specific project
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project summary data
 */
async function getProjectSummary(projectId) {
  try {
    if (projectId === 'golden-sons') {
      const data = await readJsonFile('golden-sons-complete-data-march.json');
      return {
        ...data.metaData,
        executiveSummary: data.companyDocuments.executiveSummary
      };
    } else if (projectId === 'vueltas-del-rio') {
      const memo = await readJsonFile('PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json');
      const appraisal = await readJsonFile('Vueltas_Del_Rio_Main_Geological_Appraisal.json');
      
      return {
        projectName: memo.project_name,
        summary: memo.introduction.summary,
        resourceEstimate: memo.mineral_resource_estimate.tables[0],
        conclusion: memo.conclusion.summary,
        recommendation: memo.conclusion.recommendation,
        executiveSummary: appraisal.report.executive_summary
      };
    }
    
    throw new Error(`Project ${projectId} not found`);
  } catch (error) {
    logger.error(`Error retrieving project summary for ${projectId}`, { error });
    throw error;
  }
}

/**
 * Get financial data for a specific project
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project financial data
 */
async function getProjectFinancials(projectId) {
  try {
    if (projectId === 'golden-sons') {
      const data = await readJsonFile('golden-sons-complete-data-march.json');
      return {
        profitLoss: data.financialData['P&L'],
        balanceSheet: data.financialData.BS,
        cashFlow: data.financialData['Cash Flow'],
      };
    } else if (projectId === 'vueltas-del-rio') {
      const memo = await readJsonFile('PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json');
      
      return {
        lifeOfMineCashflow: memo.economic_cashflow_modelling.tables[0],
        npvAndIrr: memo.economic_cashflow_modelling.tables[1],
      };
    }
    
    throw new Error(`Project ${projectId} not found`);
  } catch (error) {
    logger.error(`Error retrieving financial data for ${projectId}`, { error });
    throw error;
  }
}

/**
 * Get operational data for a specific project
 * @param {string} projectId - Project identifier
 * @returns {Promise<Object>} Project operational data
 */
async function getProjectOperationalData(projectId) {
  try {
    if (projectId === 'golden-sons') {
      const data = await readJsonFile('golden-sons-complete-data-march.json');
      
      // Extract mining and processing data
      const mineProduction = data.financialData['P&L'].filter(
        item => item.type !== 'header' && 
        (item.category.includes('Waste Rock') || 
         item.category.includes('Ore Mined') || 
         item.category.includes('Strip Ratio') ||
         item.category.includes('Au grade'))
      );
      
      const processing = data.financialData['P&L'].filter(
        item => item.type !== 'header' && 
        (item.category.includes('Processing') || 
         item.category.includes('Recovery') ||
         item.category.includes('Contained Gold'))
      );
      
      return {
        mineProduction,
        processing
      };
    } else if (projectId === 'vueltas-del-rio') {
      const summary = await readJsonFile('Vueltas_Del_Rio_Desktop_Study_Summary.json');
      
      // Extract pit tonnage table
      const pitTonnage = summary.pages.find(page => page.title === "Pit Ore Tonnage by Ore Type")
                               ?.content[0]?.data || [];
      
      // Extract production schedule
      const productionSchedule = summary.pages.find(page => page.title === "Cashflow Model Production")
                                      ?.content[0]?.sections || [];
      
      return {
        pitTonnage,
        productionSchedule
      };
    }
    
    throw new Error(`Project ${projectId} not found`);
  } catch (error) {
    logger.error(`Error retrieving operational data for ${projectId}`, { error });
    throw error;
  }
}

/**
 * Helper function to read a JSON file from the data directory
 * @param {string} filename - Name of the JSON file
 * @returns {Promise<Object>} Parsed JSON data
 */
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading JSON file: ${filename}`, { error });
    throw new Error(`Failed to read file: ${filename}`);
  }
}

module.exports = {
  listProjects,
  getProjectSummary,
  getProjectFinancials,
  getProjectOperationalData
};
