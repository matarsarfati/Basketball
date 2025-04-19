// src/workouts/planning/SessionCell.jsx
import React, { useState } from 'react';

/**
 * SessionCell Component
 * 
 * Represents a single session cell in the weekly planner
 * Shows drill details directly in the main table view
 * Can be clicked to view/edit session details
 */
const SessionCell = ({ session, dayIndex, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionData, setSessionData] = useState(() => ({
    ...session,
    drills: session.drills || [],
    numberOfFields: session.numberOfFields || 1,
    sequences: session.sequences || ''
  }));
  const [editingDrillIndex, setEditingDrillIndex] = useState(null);
  
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
    // Make sure the session has a drills array
    const updatedSessionData = {
      ...session,
      drills: session.drills || [],
      numberOfFields: session.numberOfFields || 1,
      sequences: session.sequences || ''
    };
    setSessionData(updatedSessionData);
    setIsEditing(true);
  };
  
  // Handle saving changes
  const handleSave = () => {
    console.log("Saving session data:", sessionData);
    onUpdate(sessionData);
    setIsEditing(false);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: name === 'numberOfFields' || name === 'duration' || name === 'intensity' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  // Handle status change
  const handleStatusChange = (status) => {
    setSessionData(prev => ({
      ...prev,
      status
    }));
  };

  // Calculate planned intensity based on the formula
  const calculatePlannedIntensity = (drill) => {
    if (!drill.totalTime) return 0;
    const contactMultiplier = drill.contact ? 1.6 : 1.0;
    const intensity = (drill.workTime / drill.totalTime) * (drill.numberOfFields / 2) * contactMultiplier;
    return parseFloat(intensity.toFixed(1));
  };

  // Handle removing a drill
  const handleRemoveDrill = (index) => {
    setSessionData(prev => ({
      ...prev,
      drills: prev.drills.filter((_, i) => i !== index)
    }));
  };

  // Calculate intensity difference
  const getIntensityDifference = (planned, perceived) => {
    if (!perceived) return null;
    return (perceived - planned).toFixed(1);
  };

  // Get the color class based on intensity difference
  const getIntensityDifferenceColor = (diff) => {
    if (diff === null) return 'text-gray-500';
    if (diff > 1) return 'text-red-500';
    if (diff < -1) return 'text-green-500';
    return 'text-yellow-500';
  };
  
  return (
    <>
      {/* Cell Display - Shows drill details */}
      <div 
        className={`p-3 border-r border-b cursor-pointer transition-colors duration-200 hover:bg-blue-50 ${getStatusStyles()}`}
        onClick={handleCellClick}
      >
        {session.title ? (
          <>
            <h4 className="font-medium text-gray-800 text-center">{session.title}</h4>
            
            {/* Session Summary for Grid Display */}
            {session.drills && session.drills.length > 0 ? (
              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50 mb-3">
                <div className="text-xs text-gray-600 flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">
                    {session.drills.reduce((total, drill) => total + (drill.totalTime || 0), 0)} min
                  </span>
                </div>
                <div className="text-xs text-gray-600 flex justify-between">
                  <span>Fields:</span>
                  <span className="font-semibold">
                    {session.drills.reduce((total, drill) => total + (drill.numberOfFields || 0), 0)}
                  </span>
                </div>
                {session.drills.some(drill => drill.plannedIntensity) && (
                  <div className="text-xs flex justify-between">
                    <span className="text-gray-600">Intensity:</span>
                    {(() => {
                      const avgIntensity = session.drills.reduce((sum, drill) => 
                        sum + (drill.plannedIntensity || 0), 0) / session.drills.length;
                      
                      let intensityClass;
                      if (avgIntensity > 7) {
                        intensityClass = "text-red-600";
                      } else if (avgIntensity > 4) {
                        intensityClass = "text-amber-600";
                      } else {
                        intensityClass = "text-green-600";
                      }
                      
                      return (
                        <span className={`${intensityClass} font-semibold`}>
                          {avgIntensity.toFixed(1)}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : null}
            
            {/* List each drill separately with details */}
            {session.drills && session.drills.length > 0 ? (
              <div className="mt-2">
                {session.drills.map((drill, index) => (
                  <div key={index} className="text-xs mb-1 pb-1 border-b border-gray-100 last:border-b-0">
                    <div className="font-medium flex justify-between">
                      <span>{drill.name}</span>
                      {drill.contact && <span className="text-blue-600 text-xs">C</span>}
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{drill.totalTime} min</span>
                      <span>{drill.numberOfFields} court{drill.numberOfFields !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
                
                {/* Session totals at the bottom */}
                <div className="mt-2 pt-1 border-t border-gray-200 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total time:</span>
                    <span>{session.drills.reduce((total, drill) => total + (drill.totalTime || 0), 0)} min</span>
                  </div>
                  
                  {session.drills.some(drill => drill.plannedIntensity) && (
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      {(() => {
                        const avgIntensity = session.drills.reduce((sum, drill) => 
                          sum + (drill.plannedIntensity || 0), 0) / session.drills.length;
                        
                        let intensityClass;
                        if (avgIntensity > 7) {
                          intensityClass = "text-red-600";
                        } else if (avgIntensity > 4) {
                          intensityClass = "text-amber-600";
                        } else {
                          intensityClass = "text-green-600";
                        }
                        
                        return (
                          <span className={intensityClass}>
                            {avgIntensity.toFixed(1)}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">
                {session.duration > 0 ? `${session.duration} min` : "No drill details"}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400 italic">No session planned</div>
        )}
      </div>
      
      {/* Edit Session Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="bg-blue-700 text-white px-6 py-4 rounded-t-lg sticky top-0 z-10 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit Session</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-grow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={sessionData.title || ''}
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
                  value={sessionData.description || ''}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Session details..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
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

              {/* Practice Drills Section */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Practice Drills</h4>
                
                {/* Drill List */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 uppercase">Drill Name</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Work Time</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Total Time</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Fields</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Contact</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Planned Intensity</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Perceived Intensity</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Difference</th>
                        <th className="py-2 px-3 text-center text-xs font-medium text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessionData.drills && sessionData.drills.length > 0 ? (
                        sessionData.drills.map((drill, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm text-gray-800">
                              {editingDrillIndex === index ? (
                                <input
                                  type="text"
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  value={drill.name}
                                  onChange={(e) => {
                                    const updatedDrills = [...sessionData.drills];
                                    updatedDrills[index].name = e.target.value;
                                    setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                  }}
                                />
                              ) : (
                                drill.name
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              {editingDrillIndex === index ? (
                                <input
                                  type="number"
                                  className="w-16 p-1 border border-gray-300 rounded text-center text-sm"
                                  value={drill.workTime}
                                  onChange={(e) => {
                                    const updatedDrills = [...sessionData.drills];
                                    updatedDrills[index].workTime = parseFloat(e.target.value) || 0;
                                    updatedDrills[index].plannedIntensity = calculatePlannedIntensity(updatedDrills[index]);
                                    setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                  }}
                                />
                              ) : (
                                `${drill.workTime} min`
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              {editingDrillIndex === index ? (
                                <input
                                  type="number"
                                  className="w-16 p-1 border border-gray-300 rounded text-center text-sm"
                                  value={drill.totalTime}
                                  onChange={(e) => {
                                    const updatedDrills = [...sessionData.drills];
                                    updatedDrills[index].totalTime = parseFloat(e.target.value) || 0;
                                    updatedDrills[index].plannedIntensity = calculatePlannedIntensity(updatedDrills[index]);
                                    setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                  }}
                                />
                              ) : (
                                `${drill.totalTime} min`
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              {editingDrillIndex === index ? (
                                <input
                                  type="number"
                                  className="w-16 p-1 border border-gray-300 rounded text-center text-sm"
                                  value={drill.numberOfFields}
                                  onChange={(e) => {
                                    const updatedDrills = [...sessionData.drills];
                                    updatedDrills[index].numberOfFields = parseFloat(e.target.value) || 1;
                                    updatedDrills[index].plannedIntensity = calculatePlannedIntensity(updatedDrills[index]);
                                    setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                  }}
                                />
                              ) : (
                                drill.numberOfFields
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              {editingDrillIndex === index ? (
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 rounded"
                                  checked={drill.contact}
                                  onChange={(e) => {
                                    const updatedDrills = [...sessionData.drills];
                                    updatedDrills[index].contact = e.target.checked;
                                    updatedDrills[index].plannedIntensity = calculatePlannedIntensity(updatedDrills[index]);
                                    setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                  }}
                                />
                              ) : (
                                drill.contact ? "Yes" : "No"
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">{drill.plannedIntensity}</td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                value={drill.perceivedIntensity || 0}
                                onChange={(e) => {
                                  const updatedDrills = [...sessionData.drills];
                                  updatedDrills[index].perceivedIntensity = parseFloat(e.target.value) || 0;
                                  setSessionData(prev => ({ ...prev, drills: updatedDrills }));
                                }}
                                className="w-16 p-1 border border-gray-300 rounded text-center"
                              />
                            </td>
                            <td className="py-2 px-3 text-sm text-center">
                              {drill.perceivedIntensity ? (
                                <span className={getIntensityDifferenceColor(
                                  getIntensityDifference(drill.plannedIntensity, drill.perceivedIntensity)
                                )}>
                                  {getIntensityDifference(drill.plannedIntensity, drill.perceivedIntensity)}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-800 text-center">
                              <div className="flex justify-center space-x-2">
                                {editingDrillIndex === index ? (
                                  <button
                                    onClick={() => setEditingDrillIndex(null)}
                                    className="text-green-600 hover:text-green-800"
                                    title="Save changes"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setEditingDrillIndex(index)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit drill"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveDrill(index)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete drill"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="py-4 text-center text-gray-500">
                            No drills added yet. Click the "+ Add Drill" button to add drills.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="9" className="py-2 px-3">
                          <button
                            onClick={() => {
                              // Add a new empty drill and immediately set it to edit mode
                              const newDrill = {
                                name: '',
                                workTime: 0,
                                totalTime: 0,
                                numberOfFields: 1,
                                contact: false,
                                plannedIntensity: 0,
                                perceivedIntensity: 0
                              };
                              const newIndex = sessionData.drills.length;
                              setSessionData(prev => ({
                                ...prev,
                                drills: [...prev.drills, newDrill]
                              }));
                              setEditingDrillIndex(newIndex);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm w-full text-center"
                          >
                            + Add Drill
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Summary Section */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h5 className="font-medium text-blue-800 mb-3">Session Summary</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Work Time */}
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Total Work Time</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {sessionData.drills.reduce((total, drill) => total + (drill.workTime || 0), 0)} min
                      </div>
                    </div>
                    
                    {/* Total Fields */}
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Total Fields Used</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {sessionData.drills.reduce((total, drill) => total + (drill.numberOfFields || 0), 0)}
                      </div>
                    </div>
                    
                    {/* Average Planned Intensity */}
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Avg. Planned Intensity</div>
                      <div className="text-lg font-semibold">
                        {(() => {
                          const avgIntensity = sessionData.drills.length > 0 
                            ? sessionData.drills.reduce((sum, drill) => sum + (drill.plannedIntensity || 0), 0) / sessionData.drills.length
                            : 0;
                          
                          let intensityClass;
                          if (avgIntensity > 7) {
                            intensityClass = "text-red-600";
                          } else if (avgIntensity > 4) {
                            intensityClass = "text-amber-600";
                          } else {
                            intensityClass = "text-green-600";
                          }
                          
                          return (
                            <span className={intensityClass}>
                              {avgIntensity.toFixed(1)}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional metrics can be added here */}
                  <div className="mt-3 text-xs text-gray-500 italic">
                    These totals are calculated based on all drills in this session.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2 border-t border-gray-200 rounded-b-lg">
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
      )}
    </>
  );
};

export default SessionCell;