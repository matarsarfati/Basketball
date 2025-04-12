import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../shared/utils/dateUtils';
import { useWorkoutContext } from '../../context/WorkoutContext';
import ActualPerformanceComparison from './ActualPerformanceComparison';
import WorkoutPerformModal from '../planner/WorkoutPerformModal';

/**
 * WorkoutHistory Component
 * 
 * Displays a list of saved workout plans for a player with performance tracking:
 * - View saved workout plans
 * - See if a workout has been performed
 * - View performance metrics (duration, RPE)
 * - Log or view actual performance data
 * - Load a plan for editing
 * - Delete or duplicate a plan
 */
const WorkoutHistory = ({ playerId }) => {
  const navigate = useNavigate();
  const { getPlayerWorkoutPlans, loadWorkoutPlan, deleteWorkoutPlan, duplicateWorkoutPlan } = useWorkoutContext();
  
  // State for workout comparison view
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  // State for perform workout modal
  const [showPerformModal, setShowPerformModal] = useState(false);
  const [workoutToPerform, setWorkoutToPerform] = useState(null);
  
  // Get all workout plans for this player
  const playerWorkouts = getPlayerWorkoutPlans(playerId);
  
  // Sort workouts by creation date (newest first)
  const sortedWorkouts = [...playerWorkouts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  // Count blocks and exercises in a workout plan
  const countWorkoutComponents = (workout) => {
    const blockCount = workout.blocks.length;
    const exerciseCount = workout.blocks.reduce(
      (total, block) => total + block.exercises.length, 
      0
    );
    
    return { blockCount, exerciseCount };
  };
  
  // Calculate performance ratio (actual vs planned)
  const calculatePerformanceRatio = (workout) => {
    if (!workout.actualPerformance) return null;
    
    let plannedVolume = 0;
    let actualVolume = 0;
    
    // For each block in the workout
    workout.blocks.forEach(block => {
      // For each exercise in the block
      block.exercises.forEach(exercise => {
        // Calculate planned volume (sets * reps * weight)
        plannedVolume += (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
        
        // Find the corresponding actual exercise
        const actualBlock = workout.actualPerformance.blocks.find(b => b.blockId === block.id);
        if (!actualBlock) return;
        
        const actualExercise = actualBlock.exercises.find(e => e.exerciseId === exercise.exerciseId);
        if (!actualExercise) return;
        
        // Calculate actual volume (sets * reps * weight)
        actualVolume += (actualExercise.actualSets || 0) * 
                      (actualExercise.actualReps || 0) * 
                      (actualExercise.actualWeight || 0);
      });
    });
    
    // Calculate ratio (actual / planned)
    if (plannedVolume === 0) return 100; // Avoid division by zero
    
    return Math.round((actualVolume / plannedVolume) * 100);
  };
  
  // Handle loading a workout for editing
  const handleLoadWorkout = (planId) => {
    loadWorkoutPlan(planId);
    navigate('/workouts');
  };
  
  // Handle deleting a workout
  const handleDeleteWorkout = (planId, planName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${planName}"?`);
    if (confirmDelete) {
      deleteWorkoutPlan(planId);
    }
  };
  
  // Handle duplicating a workout
  const handleDuplicateWorkout = (planId) => {
    duplicateWorkoutPlan(planId);
  };
  
  // Handle logging performance for a workout
  const handleLogPerformance = (workout) => {
    setWorkoutToPerform(workout);
    setShowPerformModal(true);
  };
  
  // Handle viewing performance comparison
  const handleViewPerformance = (workout) => {
    setSelectedWorkout(workout);
  };
  
  // Close performance comparison view
  const closePerformanceView = () => {
    setSelectedWorkout(null);
  };
  
  // If no workouts, show a message
  if (sortedWorkouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Workout History
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No saved workout plans found.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Workout
          </button>
        </div>
      </div>
    );
  }
  
  // When a workout is selected for performance comparison
  if (selectedWorkout) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Performance Analysis: {selectedWorkout.name}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(selectedWorkout.actualPerformance?.date || selectedWorkout.targetDate)}
            </p>
          </div>
          <button
            onClick={closePerformanceView}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Workout List
          </button>
        </div>
        
        <ActualPerformanceComparison workout={selectedWorkout} />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold text-gray-700">
          Workout History
        </h3>
        <button
          onClick={() => navigate('/workouts')}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Workout
        </button>
      </div>
      
      {/* Workout List */}
      <div className="space-y-4">
        {sortedWorkouts.map((workout) => {
          const { blockCount, exerciseCount } = countWorkoutComponents(workout);
          const hasPerformed = Boolean(workout.actualPerformance);
          const performanceRatio = hasPerformed ? calculatePerformanceRatio(workout) : null;
          const performanceDate = hasPerformed ? new Date(workout.actualPerformance.date) : null;
          const createdDate = new Date(workout.createdAt);
          
          return (
            <div key={workout.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md">
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-800">{workout.name}</h4>
                  {hasPerformed && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Performed
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {hasPerformed 
                    ? `Performed: ${formatDate(performanceDate)}`
                    : `Created: ${formatDate(createdDate)}`
                  }
                </span>
              </div>
              
              <div className="p-4">
                {/* Workout Stats */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {blockCount} {blockCount === 1 ? 'Block' : 'Blocks'}
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {exerciseCount} {exerciseCount === 1 ? 'Exercise' : 'Exercises'}
                  </div>
                  
                  {/* Performance Stats (if performed) */}
                  {hasPerformed && (
                    <>
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        RPE: {workout.actualPerformance.rpe}
                      </div>
                      <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {workout.actualPerformance.duration} min
                      </div>
                      <div className={`px-3 py-1 rounded-full ${
                        performanceRatio >= 95 ? 'bg-green-100 text-green-800' :
                        performanceRatio >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {performanceRatio}% Completion
                      </div>
                    </>
                  )}
                </div>
                
                {/* Description */}
                {workout.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {workout.description}
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleDuplicateWorkout(workout.id)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                  
                  {/* Log Performance Button */}
                  <button
                    onClick={() => handleLogPerformance(workout)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      hasPerformed 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {hasPerformed ? 'Update Performance' : 'Log Performance'}
                  </button>
                  
                  {/* View Performance Button (only if performed) */}
                  {hasPerformed && (
                    <button
                      onClick={() => handleViewPerformance(workout)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      View Analysis
                    </button>
                  )}
                  
                  {/* Edit Workout Button */}
                  <button
                    onClick={() => handleLoadWorkout(workout.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Edit Workout
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Workout Performance Modal */}
      {showPerformModal && workoutToPerform && (
        <WorkoutPerformModal
          isOpen={showPerformModal}
          onClose={() => setShowPerformModal(false)}
          workoutPlan={workoutToPerform}
        />
      )}
    </div>
  );
};

export default WorkoutHistory;