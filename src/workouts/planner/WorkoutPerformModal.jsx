import React, { useState, useEffect, useRef } from 'react';
import { useWorkoutContext } from '../../context/WorkoutContext';

/**
 * WorkoutPerformModal Component
 * 
 * Modal for recording actual performance data for a workout, including:
 * - Date the workout was performed
 * - Duration of the workout
 * - Rate of Perceived Exertion (RPE)
 * - Actual sets, reps, and weight for each exercise
 * - Notes/comments about the workout
 */
const WorkoutPerformModal = ({ 
  isOpen, 
  onClose, 
  workoutPlan 
}) => {
  const { saveActualPerformance, showToast } = useWorkoutContext();
  const modalRef = useRef(null);
  
  // Initialize performance data from existing data or defaults
  const initialData = workoutPlan.actualPerformance ? {
    ...workoutPlan.actualPerformance
  } : {
    date: new Date().toISOString().split('T')[0], // Today's date
    duration: 60, // Default to 60 minutes
    rpe: 7, // Default to 7 RPE
    notes: '', // Default to empty notes
    blocks: workoutPlan.blocks.map(block => ({
      blockId: block.id,
      notes: '',
      exercises: block.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        actualSets: exercise.sets,
        actualReps: exercise.reps,
        actualWeight: exercise.weight,
        notes: '',
      }))
    }))
  };
  
  // State for performance data
  const [performanceData, setPerformanceData] = useState(initialData);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  
  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Reset state when workout changes
  useEffect(() => {
    setPerformanceData(initialData);
    setConfirmOverwrite(false);
  }, [workoutPlan.id]);
  
  // Handle general field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerformanceData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle numeric field changes
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numValue = name === 'rpe' ? parseFloat(value) : parseInt(value);
    
    if (!isNaN(numValue)) {
      setPerformanceData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };
  
  // Handle exercise data changes
  const handleExerciseChange = (blockIndex, exerciseIndex, field, value) => {
    // Create deep copy of performance data
    const updatedData = { ...performanceData };
    const numValue = ['actualSets', 'actualReps'].includes(field) 
      ? parseInt(value) 
      : parseFloat(value);
    
    // Update the specific field
    if (!isNaN(numValue) || field === 'notes') {
      updatedData.blocks[blockIndex].exercises[exerciseIndex][field] = 
        field === 'notes' ? value : numValue;
      
      setPerformanceData(updatedData);
    }
  };
  
  // Handle block notes change
  const handleBlockNotesChange = (blockIndex, value) => {
    const updatedData = { ...performanceData };
    updatedData.blocks[blockIndex].notes = value;
    setPerformanceData(updatedData);
  };
  
  // Handle save
  const handleSave = () => {
    // Check if we need confirmation to overwrite
    if (workoutPlan.actualPerformance && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }
    
    // Validate the data
    if (!performanceData.date) {
      showToast('Please enter the date when this workout was performed', 'error');
      return;
    }
    
    if (!performanceData.duration || performanceData.duration <= 0) {
      showToast('Please enter a valid workout duration', 'error');
      return;
    }
    
    if (!performanceData.rpe || performanceData.rpe < 1 || performanceData.rpe > 10) {
      showToast('Please enter a valid RPE value (1-10)', 'error');
      return;
    }
    
    // Save the performance data
    const success = saveActualPerformance(workoutPlan.id, performanceData);
    
    if (success) {
      onClose();
    }
  };
  
  // Find the original exercise details from the workout plan
  const findExerciseInPlan = (exerciseId) => {
    for (const block of workoutPlan.blocks) {
      const exercise = block.exercises.find(e => e.exerciseId === exerciseId);
      if (exercise) return exercise;
    }
    return null;
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">Record Workout Performance</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Overwrite Confirmation */}
        {confirmOverwrite && (
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
            <div className="flex items-center text-yellow-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Performance data already exists for this workout.</span>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              Recording new data will overwrite the previous performance record. Continue?
            </p>
            <div className="mt-3 flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOverwrite(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Overwrite Previous Data
              </button>
            </div>
          </div>
        )}
        
        {/* Modal Content */}
        <div className="p-6">
          {/* General Workout Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Workout Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Performed */}
              <div>
                <label 
                  htmlFor="date" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Performed
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={performanceData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Duration */}
              <div>
                <label 
                  htmlFor="duration" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  max="240"
                  value={performanceData.duration}
                  onChange={handleNumericChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* RPE */}
              <div>
                <label 
                  htmlFor="rpe" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  RPE (1-10)
                </label>
                <input
                  type="number"
                  id="rpe"
                  name="rpe"
                  min="1"
                  max="10"
                  step="0.5"
                  value={performanceData.rpe}
                  onChange={handleNumericChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Rate of Perceived Exertion: 1 (very easy) to 10 (maximal effort)
                </p>
              </div>
            </div>
            
            {/* Workout Notes */}
            <div className="mt-4">
              <label 
                htmlFor="notes" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Overall Workout Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                value={performanceData.notes || ''}
                onChange={handleChange}
                placeholder="Enter any general notes about this workout session..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          
          {/* Exercise Performance Data */}
          <div>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
              Exercise Performance
            </h3>
            
            {performanceData.blocks.map((block, blockIndex) => {
              // Find the original block from the workout plan
              const originalBlock = workoutPlan.blocks.find(b => b.id === block.blockId);
              
              return (
                <div 
                  key={block.blockId} 
                  className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <h4 className="font-medium text-gray-800 mb-3">
                    {originalBlock?.title || `Block ${blockIndex + 1}`}
                  </h4>
                  
                  {/* Block Notes */}
                  <div className="mb-4">
                    <label 
                      htmlFor={`block-${blockIndex}-notes`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Block Notes
                    </label>
                    <textarea
                      id={`block-${blockIndex}-notes`}
                      rows="2"
                      value={block.notes || ''}
                      onChange={(e) => handleBlockNotesChange(blockIndex, e.target.value)}
                      placeholder="Enter notes about this block..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  {/* Exercises Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Exercise
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sets (Planned)
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reps (Planned)
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight (Planned)
                          </th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {block.exercises.map((exercise, exerciseIndex) => {
                          // Find the original exercise from the workout plan
                          const originalExercise = findExerciseInPlan(exercise.exerciseId);
                          
                          return (
                            <tr key={exercise.exerciseId}>
                              {/* Exercise Name */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 bg-cover bg-center rounded-md" 
                                    style={{ backgroundImage: `url(${originalExercise?.imagePath})` }}>
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">
                                      {originalExercise?.name || `Exercise ${exerciseIndex + 1}`}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              
                              {/* Sets */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={exercise.actualSets || 0}
                                    onChange={(e) => handleExerciseChange(
                                      blockIndex, 
                                      exerciseIndex, 
                                      'actualSets', 
                                      e.target.value
                                    )}
                                    className="w-16 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({originalExercise?.sets || 0})
                                  </span>
                                </div>
                              </td>
                              
                              {/* Reps */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={exercise.actualReps || 0}
                                    onChange={(e) => handleExerciseChange(
                                      blockIndex, 
                                      exerciseIndex, 
                                      'actualReps', 
                                      e.target.value
                                    )}
                                    className="w-16 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({originalExercise?.reps || 0})
                                  </span>
                                </div>
                              </td>
                              
                              {/* Weight */}
                              <td className="px-3 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    min="0"
                                    step="2.5"
                                    value={exercise.actualWeight || 0}
                                    onChange={(e) => handleExerciseChange(
                                      blockIndex, 
                                      exerciseIndex, 
                                      'actualWeight', 
                                      e.target.value
                                    )}
                                    className="w-20 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({originalExercise?.weight || 0} kg)
                                  </span>
                                </div>
                              </td>
                              
                              {/* Notes */}
                              <td className="px-3 py-3">
                                <input
                                  type="text"
                                  value={exercise.notes || ''}
                                  onChange={(e) => handleExerciseChange(
                                    blockIndex, 
                                    exerciseIndex, 
                                    'notes', 
                                    e.target.value
                                  )}
                                  placeholder="Notes..."
                                  className="w-full p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {workoutPlan.actualPerformance ? 'Update Performance Data' : 'Record Performance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPerformModal;