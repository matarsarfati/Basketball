// src/workouts/planning/SessionCell.jsx
import React, { useState } from 'react';

/**
 * SessionCell Component
 * 
 * Represents a single session cell in the weekly planner
 * Can be clicked to view/edit session details
 */
const SessionCell = ({ session, dayIndex, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionData, setSessionData] = useState(session);
  
  // Get status-based styling
  const getStatusStyles = () => {
    switch (session.status) {
      case 'completed':
        return 'bg-green-50 border-green-300';
      case 'canceled':
        return 'bg-red-50 border-red-300';
      default:
        return 'bg-white border-gray-200';
    }
  };
  
  // Handle opening the edit mode
  const handleCellClick = () => {
    setIsEditing(true);
  };
  
  // Handle saving changes
  const handleSave = () => {
    onUpdate(sessionData);
    setIsEditing(false);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle status change
  const handleStatusChange = (status) => {
    setSessionData(prev => ({
      ...prev,
      status
    }));
  };
  
  return (
    <>
      <div 
        className={`p-3 border-r border-b cursor-pointer transition-colors duration-200 hover:bg-blue-50 ${getStatusStyles()}`}
        onClick={handleCellClick}
      >
        {session.title ? (
          <>
            <h4 className="font-medium text-gray-800">{session.title}</h4>
            {session.duration > 0 && (
              <div className="text-xs text-gray-500">{session.duration} min</div>
            )}
            {session.drills.length > 0 && (
              <div className="text-xs text-gray-500">
                {session.drills.length} drill{session.drills.length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400 italic">No session planned</div>
        )}
      </div>
      
      {/* Edit Session Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-blue-700 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Edit Session</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={sessionData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E.g., Technical Drills, Shooting Practice"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={sessionData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Session details..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={sessionData.duration}
                    onChange={handleChange}
                    min="0"
                    max="240"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intensity (1-10)
                  </label>
                  <input
                    type="number"
                    name="intensity"
                    value={sessionData.intensity}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('planned')}
                    className={`px-3 py-1 rounded-md ${
                      sessionData.status === 'planned' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Planned
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('completed')}
                    className={`px-3 py-1 rounded-md ${
                      sessionData.status === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('canceled')}
                    className={`px-3 py-1 rounded-md ${
                      sessionData.status === 'canceled' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Canceled
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionCell;