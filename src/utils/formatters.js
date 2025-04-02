/**
 * Utility functions for formatting data
 */

/**
 * Formats a date string into a user-friendly format
 * @param {string|Date} dateStr - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateStr, options = {}) => {
    if (!dateStr) return '';
    
    const {
      format = 'medium', // 'short', 'medium', 'long'
      includeTime = false
    } = options;
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      
      let dateOptions = {};
      
      switch (format) {
        case 'short':
          dateOptions = { 
            month: 'numeric', 
            day: 'numeric', 
            year: '2-digit' 
          };
          break;
        case 'medium':
          dateOptions = { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          };
          break;
        case 'long':
          dateOptions = { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric', 
            weekday: 'long' 
          };
          break;
        default:
          dateOptions = { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          };
      }
      
      if (includeTime) {
        dateOptions.hour = '2-digit';
        dateOptions.minute = '2-digit';
      }
      
      return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };
  
  /**
   * Formats a number as currency
   * @param {number} value - Number to format
   * @param {string} currency - Currency code
   * @returns {string} - Formatted currency string
   */
  export const formatCurrency = (value, currency = 'USD') => {
    if (value === null || value === undefined) return '-';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(value);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${currency} ${value}`;
    }
  };
  
  /**
   * Truncates a string to a maximum length
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} - Truncated string
   */
  export const truncateString = (str, maxLength = 50) => {
    if (!str) return '';
    
    if (str.length <= maxLength) return str;
    
    return `${str.substring(0, maxLength)}...`;
  };
  
  /**
   * Formats a large number in a human-readable way
   * @param {number} value - Number to format
   * @returns {string} - Formatted number string
   */
  export const formatLargeNumber = (value) => {
    if (value === null || value === undefined) return '-';
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    return value.toString();
  };
  
  /**
   * Converts a camelCase or snake_case string to Title Case
   * @param {string} str - String to convert
   * @returns {string} - Converted string
   */
  export const formatTitleCase = (str) => {
    if (!str) return '';
    
    // Replace underscores and hyphens with spaces
    let result = str.replace(/[_-]/g, ' ');
    
    // Insert a space before all capital letters in camelCase
    result = result.replace(/([A-Z])/g, ' $1');
    
    // Capitalize first letter of each word
    result = result
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
    
    return result;
  };
  
  export default {
    formatDate,
    formatCurrency,
    truncateString,
    formatLargeNumber,
    formatTitleCase
  };