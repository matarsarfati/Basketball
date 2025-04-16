// src/workouts/planning/WeekSelector.jsx
import React, { useState } from 'react';
import { useWeeklyPlanningContext } from '../../context/WeeklyPlanningContext';

/**
 * WeekSelector Component
 * 
 * Allows selection of different week plans and creation of new ones
 */
const WeekSelector = () => {
  const { 
    weeklyPlans, 
    currentWeekId, 
    setCurrentWeekId, 
    createWeekPlan,
    deleteWeekPlan,
    duplicateWeekPlan
  } = useWeeklyPlanningContext();
  
  const [showNewWeekModal, setShowNewWeekModal] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Handle week selection
  const handleWeekChange = (e) => {
    setCurrentWeekId(e.target.value);
  };
  
  // Handle creating a new week
  const handleCreateWeek = () => {
    if (newWeekDate) {
      createWeekPlan(new Date(newWeekDate));
      setShowNewWeekModal(false);
    }
  };
  
  // Handle deleting a week
  const handleDeleteWeek = () => {
    if (currentWeekId) {
      const confirm = window.confirm('Are you sure you want to delete this week plan?');
      if (confirm) {
        deleteWeekPlan(currentWeekId);
      }
    }
  };
  
  // Handle duplicating a week
  const handleDuplicateWeek = () => {
    if (currentWeekId) {
      duplicateWeekPlan(currentWeekId);
    }
  };
  
  const currentWeek = weeklyPlans.find(week => week.id === currentWeekId);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <label htmlFor="weekSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Week:
          </label>
          <select
            id="weekSelect"
            value={currentWeekId || ''}
            onChange={handleWeekChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">-- Select a Week --</option>
            {weeklyPlans.map(week => (
              <option key={week.id} value={week.id}>
                {week.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNewWeekModal(true)}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Week
          </button>
          
          {currentWeek && (
            <>
              <button
                onClick={handleDuplicateWeek}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
                Duplicate
              </button>
              
              <button
                onClick={handleDeleteWeek}
                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Current week details */}
      {currentWeek && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{currentWeek.title}</h2>
          <p className="text-sm text-gray-600">
            {new Date(currentWeek.startDate).toLocaleDateString()} to {new Date(currentWeek.endDate).toLocaleDateString()}
          </p>
        </div>
      )}
      
      {/* New Week Modal */}
      {showNewWeekModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-blue-700 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Create New Week Plan</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Week Starting Date
                </label>
                <input
                  type="date"
                  value={newWeekDate}
                  onChange={(e) => setNewWeekDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Select the Monday of the week you want to create.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowNewWeekModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWeek}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Week
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekSelector;