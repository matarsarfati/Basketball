/**
 * Button Component
 * A reusable button component with different variants and sizes
 */
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  ...rest 
}) => {
  // Base classes for all buttons
  const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 transition-colors';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300',
    info: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-400',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800 focus:ring-gray-200',
  };
  
  // Disabled classes
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${variantClasses[variant] || variantClasses.primary}
    ${disabledClasses}
    ${widthClass}
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
