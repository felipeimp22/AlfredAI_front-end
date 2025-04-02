/**
 * Utility functions for chart related operations
 */

/**
 * Generates an array of colors for chart data
 * @param {number} count - Number of colors needed
 * @returns {Array} - Array of color strings
 */
export const generateColors = (count) => {
    const baseColors = [
      '#4e79a7', // blue
      '#f28e2c', // orange
      '#e15759', // red
      '#76b7b2', // teal
      '#59a14f', // green
      '#edc949', // yellow
      '#af7aa1', // purple
      '#ff9da7', // pink
      '#9c755f', // brown
      '#bab0ab'  // gray
    ];
    
    // If we need more colors than in our base set, we'll repeat with different opacity
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  };
  
  /**
   * Converts a chart object from the API response format to Chart.js format
   * @param {Object} apiChart - Chart object from API
   * @returns {Object} - Chart object for Chart.js
   */
  export const convertApiChartToChartJs = (apiChart) => {
    if (!apiChart) return null;
    
    // Create a deep copy of the chart to avoid mutations
    const chart = JSON.parse(JSON.stringify(apiChart));
    
    // Add colors if not present
    if (chart.data && chart.data.datasets) {
      chart.data.datasets = chart.data.datasets.map((dataset, index) => {
        if (!dataset.backgroundColor) {
          const colors = generateColors(chart.data.datasets.length);
          
          if (chart.type === 'pie' || chart.type === 'doughnut') {
            dataset.backgroundColor = generateColors(chart.data.labels.length);
          } else if (chart.type === 'line') {
            dataset.borderColor = colors[index];
            dataset.backgroundColor = 'transparent';
          } else {
            dataset.backgroundColor = colors[index];
          }
        }
        
        return dataset;
      });
    }
    
    return chart;
  };
  
  /**
   * Determines the best chart type for a given data structure
   * @param {Object} data - The data to visualize
   * @returns {string} - Recommended chart type
   */
  export const determineChartType = (data) => {
    if (!data || !data.labels || !data.datasets) return 'bar';
    
    // Check for time series data
    const hasDateLabels = data.labels.some(label => 
      !isNaN(Date.parse(label)) || 
      label.match(/^\d{4}-\d{2}-\d{2}/) ||
      label.includes('Jan') || 
      label.includes('Feb') || 
      label.includes('Mar')
    );
    
    if (hasDateLabels) return 'line';
    
    // For small datasets with few categories, pie charts work well
    if (data.labels.length <= 6) return 'pie';
    
    // Default to bar chart
    return 'bar';
  };
  
  /**
   * Formats numbers for display
   * @param {number} value - The number to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted number
   */
  export const formatNumber = (value, options = {}) => {
    if (value === null || value === undefined) return '-';
    
    const {
      precision = 2,
      format = 'standard', // 'standard', 'compact', 'currency'
      currency = 'USD'
    } = options;
    
    try {
      if (format === 'compact') {
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: precision
        }).format(value);
      }
      
      if (format === 'currency') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: precision
        }).format(value);
      }
      
      // Standard format
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: precision
      }).format(value);
    } catch (error) {
      console.error('Error formatting number:', error);
      return value.toString();
    }
  };
  
  export default {
    generateColors,
    convertApiChartToChartJs,
    determineChartType,
    formatNumber
  };