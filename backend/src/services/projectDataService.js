const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * Reads and parses a JSON file from the data/provided directory
 * @param {string} filename - The name of the JSON file
 * @returns {Object} The parsed JSON data
 */
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../../../data/provided', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    logger.error(`Error reading JSON file ${filename}:`, error);
    throw new Error(`Failed to read data file: ${filename}`);
  }
};

/**
 * Lists all available projects
 * @returns {Array} List of projects with basic information
 */
const listProjects = () => {
  try {
    // For now, we're focusing only on the Golden Sons project
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    return [
      {
        id: 'golden-sons',
        name: goldenSonsData.metaData?.projectName || 'Golden Sons Mining - Minas y Cuevas Project',
        description: goldenSonsData.companyDocuments?.executiveSummary?.overview || 'Gold mining project with significant upside potential',
        location: 'Honduras, Central America',
        dataDate: goldenSonsData.metaData?.dataPreparationDate || 'April 2025',
      }
    ];
  } catch (error) {
    logger.error('Error listing projects:', error);
    throw error;
  }
};

/**
 * Gets financial data for the Golden Sons project
 * @returns {Object} Financial data including P&L, Balance Sheet, and Cash Flow
 */
const getGoldenSonsFinancials = () => {
  try {
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    
    return {
      pnl: goldenSonsData.financialData?.['P&L'] || [],
      balanceSheet: goldenSonsData.financialData?.['BS'] || [],
      cashFlow: goldenSonsData.financialData?.['Cash Flow'] || []
    };
  } catch (error) {
    logger.error('Error getting Golden Sons financials:', error);
    throw error;
  }
};

/**
 * Gets key metrics and highlights for the Golden Sons project
 * @returns {Object} Key metrics including NPV, IRR, payback period, etc.
 */
const getGoldenSonsKeyMetrics = () => {
  try {
    // Get data from multiple source files for comprehensive metrics
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    const peStudyData = readJsonFile('PE_Vueltas_Desktop_Study_Memo_Oct_17_2023.json');
    const desktopStudyData = readJsonFile('Vueltas_Del_Rio_Desktop_Study_Summary.json');
    
    // Get recovery rates and other metrics
    const recoveryRates = goldenSonsData.metaData?.recoveryRates || {
      oxide: "78.0%",
      transition: "67.0%",
      sulfide: "52.0%"
    };
    
    // Extract NPV and IRR from different sources to show different scenarios
    const npvValues = {
      // From the main Golden Sons data (current gold price assumption)
      current: {
        value: goldenSonsData.metaData?.keyEconomicMetrics?.npv5 || "$158M",
        goldPrice: goldenSonsData.metaData?.goldPriceAssumptions?.financialProjection || "$3,100/oz", 
        discountRate: "5%"
      },
      // From PE Study (historical analysis)
      peStudy: {
        value: peStudyData.economic_cashflow_modelling?.tables?.find(t => t.table_number === 6)?.data?.find(d => d.Metric === "NPV (5%)")?.["After-Tax ($)"] || 131926508,
        goldPrice: "$1,850/oz", // From PE study input params
        discountRate: "5%"
      }
    };
    
    const irrValues = {
      current: {
        value: goldenSonsData.metaData?.keyEconomicMetrics?.postTaxIRR || "91%",
        goldPrice: goldenSonsData.metaData?.goldPriceAssumptions?.financialProjection || "$3,100/oz"
      },
      peStudy: {
        value: peStudyData.economic_cashflow_modelling?.tables?.find(t => t.table_number === 6)?.irr_payback?.["IRR (After-Tax)"] || "106%",
        goldPrice: "$1,850/oz"
      }
    };
    
    // Get resource estimates
    const resourceEstimates = {
      totalTonnes: 8331727, // from the financials
      averageGrade: "1.43 g/t", // from the financials
      totalRecoverableGold: goldenSonsData.metaData?.totalRecoverableGold || "234,709 oz",
      recoveryRate: "61.1%" // weighted average recovery rate
    };
    
    // Extract annual periods data
    let periodsData = {};
    const pnlData = goldenSonsData.financialData?.['P&L'] || [];
    
    // Find total line items for key metrics
    const oreMined = pnlData.find(item => item.category === "Ore Mined");
    const wasteRock = pnlData.find(item => item.category === "Waste Rock");
    const totalOpenPitMined = pnlData.find(item => item.category === "Total Open Pit Mined");
    const stripRatio = pnlData.find(item => item.category === "Strip Ratio (OP)");
    const auGrade = pnlData.find(item => item.category === "Au grade" && item.unit === "g/t");
    const totalRecoveredGold = pnlData.find(item => item.category === "Total Recovered Gold");
    const revenue = pnlData.find(item => item.category === "Revenue (Gold Price as of 3/31/25)");
    const totalOpex = pnlData.find(item => item.category === "Total Opex");
    const grossProfit = pnlData.find(item => item.category === "Gross Profit");
    const netIncomeAfterTax = pnlData.find(item => item.category === "Net Income After Tax");
    
    // Calculate average cost per ounce (simplified)
    const totalOperatingCost = parseFloat(String(totalOpex?.total || "0").replace(/,/g, ""));
    const totalGoldOunces = parseFloat(String(totalRecoveredGold?.total || "0").replace(/,/g, ""));
    const averageCostPerOunce = totalGoldOunces > 0 ? totalOperatingCost / totalGoldOunces : 0;
    
    return {
      projectName: goldenSonsData.metaData?.projectName || "Golden Sons Mining - Minas y Cuevas Project",
      projectOverview: goldenSonsData.companyDocuments?.executiveSummary?.overview || "",
      dataDate: goldenSonsData.metaData?.dataPreparationDate || "April 2025",
      npv: npvValues,
      irr: irrValues,
      paybackPeriod: goldenSonsData.metaData?.keyEconomicMetrics?.paybackPeriod || "0.8 years",
      mineLife: goldenSonsData.metaData?.mineLifeProjection || "8.5 years",
      initialCapex: { 
        value: "34,511,787", // from cashflow Capex
        unit: "$"
      },
      resources: resourceEstimates,
      production: {
        totalOreMined: oreMined?.total || "8,331,727 t",
        totalWasteRock: wasteRock?.total || "22,545,126 t",
        totalMined: totalOpenPitMined?.total || "30,876,853 t",
        averageStripRatio: stripRatio?.total || "2.7 w:o",
        averageGrade: auGrade?.total || "1.43 g/t",
        totalRecoveredGold: totalRecoveredGold?.total || "234,709 oz"
      },
      financialSummary: {
        totalRevenue: revenue?.total || "727,596,440",
        totalOpex: totalOpex?.total || "136,872,317",
        grossProfit: grossProfit?.total || "590,724,123",
        netIncomeAfterTax: netIncomeAfterTax?.total || "340,436,638",
        averageCostPerOunce: averageCostPerOunce.toFixed(2),
        goldPriceAssumption: goldenSonsData.metaData?.goldPriceAssumptions?.financialProjection || "$3,100/oz"
      },
      recoveryRates: recoveryRates
    };
  } catch (error) {
    logger.error('Error getting Golden Sons key metrics:', error);
    throw error;
  }
};

/**
 * Gets production schedule data for the Golden Sons project
 * @returns {Object} Production schedule by period
 */
const getGoldenSonsProductionSchedule = () => {
  try {
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    
    // Extract key production metrics from P&L data
    const pnlData = goldenSonsData.financialData?.['P&L'] || [];
    
    // Identify and extract specific production metrics
    const productionMetrics = [
      "Waste Rock",
      "Ore Mined",
      "Au grade",
      "Strip Ratio (OP)",
      "Processing (Total)",
      "Total Recovered Gold",
      "Revenue (Gold Price as of 3/31/25)"
    ];
    
    const productionData = {};
    
    // Extract the relevant metrics
    productionMetrics.forEach(metric => {
      const item = pnlData.find(item => item.category === metric);
      if (item && item.periods) {
        productionData[metric] = {
          unit: item.unit,
          total: item.total,
          periods: item.periods
        };
      }
    });
    
    return productionData;
  } catch (error) {
    logger.error('Error getting Golden Sons production schedule:', error);
    throw error;
  }
};

/**
 * Gets detailed cash flow data for the Golden Sons project
 * @returns {Object} Cash flow data by period
 */
const getGoldenSonsCashFlow = () => {
  try {
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    
    // Extract cash flow data
    const cashFlowData = goldenSonsData.financialData?.['Cash Flow'] || [];
    
    // Identify key cash flow metrics
    const cashFlowMetrics = [
      "Revenue",
      "(-) Operating Cost",
      "(-) Capex",
      "(-) Reclamation",
      "Cashflow (pre-tax)",
      "Cumulative Cashflow (pre-tax)",
      "(-) Income Taxes",
      "Cashflow (after-tax)"
    ];
    
    const formattedCashFlow = {};
    
    // Extract the relevant metrics
    cashFlowMetrics.forEach(metric => {
      const item = cashFlowData.find(item => item.category === metric);
      if (item) {
        formattedCashFlow[metric] = {
          unit: item.unit,
          total: item.total,
          periods: item.periods
        };
      }
    });
    
    return formattedCashFlow;
  } catch (error) {
    logger.error('Error getting Golden Sons cash flow:', error);
    throw error;
  }
};

/**
 * Gets project summary for the Golden Sons project
 * @returns {Object} Project summary information
 */
const getProjectSummary = (projectId) => {
  try {
    if (projectId !== 'golden-sons') {
      throw new Error(`Project ${projectId} not found`);
    }
    
    const goldenSonsData = readJsonFile('golden-sons-complete-data-march.json');
    
    return {
      id: 'golden-sons',
      name: goldenSonsData.metaData?.projectName || 'Golden Sons Mining - Minas y Cuevas Project',
      overview: goldenSonsData.companyDocuments?.executiveSummary?.overview || '',
      highlights: goldenSonsData.companyDocuments?.executiveSummary?.keyProjectHighlights || {},
      investmentStructure: goldenSonsData.companyDocuments?.executiveSummary?.proposedInvestmentStructure || {},
      nextSteps: goldenSonsData.companyDocuments?.executiveSummary?.nextSteps || '',
      conclusion: goldenSonsData.companyDocuments?.executiveSummary?.conclusion || ''
    };
  } catch (error) {
    logger.error(`Error getting summary for project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Gets data from geology study for Golden Sons project
 * @returns {Object} Geology study data
 */
const getGoldenSonsGeologyData = () => {
  try {
    const geologyData = readJsonFile('Vueltas_Del_Rio_Main_Geological_Appraisal.json');
    
    return {
      executiveSummary: geologyData.report?.executive_summary || {},
      resourceEstimate: geologyData.report?.sections?.find(s => s.title.includes("ECONOMIC GEOLOGY"))?.subsection || {},
      conclusions: geologyData.report?.sections?.find(s => s.title.includes("CONCLUSIONS"))?.conclusions || ''
    };
  } catch (error) {
    logger.error('Error getting Golden Sons geology data:', error);
    throw error;
  }
};

module.exports = {
  listProjects,
  getProjectSummary,
  getGoldenSonsFinancials,
  getGoldenSonsKeyMetrics,
  getGoldenSonsProductionSchedule,
  getGoldenSonsCashFlow,
  getGoldenSonsGeologyData
};
