/**
 * Date utility functions for formatting dates and calculating age
 * These functions can be used across the application for consistent date handling
 */

/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The output format (short, medium, long)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Return empty string for invalid dates
    if (isNaN(dateObj.getTime())) return '';
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'medium':
      default:
        return dateObj.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    }
  };
  
  /**
   * Calculate age from date of birth
   * @param {string|Date} dateOfBirth - Date of birth
   * @returns {number} Age in years
   */
  export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    
    // Return null for invalid dates
    if (isNaN(birthDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // If birthday hasn't occurred yet this year, subtract a year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  /**
   * Check if a date is in the past
   * @param {string|Date} date - The date to check
   * @returns {boolean} True if date is in the past
   */
  export const isPastDate = (date) => {
    if (!date) return false;
    
    const checkDate = new Date(date);
    
    // Return false for invalid dates
    if (isNaN(checkDate.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    return checkDate < today;
  };
  
  /**
   * Calculate the difference between two dates in days
   * @param {string|Date} startDate - Start date
   * @param {string|Date} endDate - End date
   * @returns {number} Number of days between dates
   */
  export const daysBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Return null for invalid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    // Calculate difference in milliseconds and convert to days
    const differenceMs = Math.abs(end - start);
    return Math.round(differenceMs / (1000 * 60 * 60 * 24));
  };
  