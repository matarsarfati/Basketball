import React, { useState, useEffect } from 'react';

/**
 * PhysicalDataForm Component
 * 
 * A form component for displaying and editing a player's physical data:
 * - Height (cm)
 * - Weight (kg)
 * - Body Fat Percentage (%)
 * 
 * Features:
 * - Controlled inputs with validation
 * - Numeric input validation
 * - Range validation for realistic values
 * - Default values for missing data
 * - Save and cancel functionality
 * - Responsive design with Tailwind CSS
 */
const PhysicalDataForm = ({
  initialData = {},
  onSave = () => {},
  onCancel = () => {},
  readOnly = false
}) => {
  // Default values for a new player
  const defaultValues = {
    height: '',
    weight: '',
    fatPercentage: ''
  };

  // Initialize form state with provided data or defaults
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialData
  });

  // Track validation errors
  const [errors, setErrors] = useState({});
  
  // Track if form is dirty (has changes)
  const [isDirty, setIsDirty] = useState(false);

  // Update form if initialData changes
  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialData
    });
    setIsDirty(false);
    setErrors({});
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Allow empty values or numeric values
    if (value === '' || (!isNaN(value) && !isNaN(parseFloat(value)))) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
      
      setIsDirty(true);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Validate height (typically 120-250 cm for basketball players)
    if (formData.height) {
      const height = parseFloat(formData.height);
      if (isNaN(height)) {
        newErrors.height = 'Must be a number';
      } else if (height < 120 || height > 250) {
        newErrors.height = 'Must be between 120-250 cm';
      }
    }
    
    // Validate weight (typically 50-150 kg for basketball players)
    if (formData.weight) {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight)) {
        newErrors.weight = 'Must be a number';
      } else if (weight < 50 || weight > 150) {
        newErrors.weight = 'Must be between 50-150 kg';
      }
    }
    
    // Validate body fat percentage (typically 3-25% for athletes)
    if (formData.fatPercentage) {
      const fatPercentage = parseFloat(formData.fatPercentage);
      if (isNaN(fatPercentage)) {
        newErrors.fatPercentage = 'Must be a number';
      } else if (fatPercentage < 3 || fatPercentage > 25) {
        newErrors.fatPercentage = 'Must be between 3-25%';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to numbers before saving
      const processedData = {
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        fatPercentage: formData.fatPercentage ? parseFloat(formData.fatPercentage) : null
      };
      
      onSave(processedData);
      setIsDirty(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      ...defaultValues,
      ...initialData
    });
    setErrors({});
    setIsDirty(false);
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
        Physical Data
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Height Field */}
          <div>
            <label 
              htmlFor="height" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (cm)
            </label>
            <input
              type="text"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Enter height"
              className={`w-full p-2 border rounded-md ${
                errors.height 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>
          
          {/* Weight Field */}
          <div>
            <label 
              htmlFor="weight" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Enter weight"
              className={`w-full p-2 border rounded-md ${
                errors.weight 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>
          
          {/* Body Fat Percentage Field */}
          <div>
            <label 
              htmlFor="fatPercentage" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Body Fat Percentage (%)
            </label>
            <input
              type="text"
              id="fatPercentage"
              name="fatPercentage"
              value={formData.fatPercentage}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Enter body fat %"
              className={`w-full p-2 border rounded-md ${
                errors.fatPercentage 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errors.fatPercentage && (
              <p className="mt-1 text-sm text-red-600">{errors.fatPercentage}</p>
            )}
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isDirty 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PhysicalDataForm;