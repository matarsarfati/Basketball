// Path: src/gym/components/ExerciseCard.jsx

import React from 'react';

/**
 * ExerciseCard Component
 * 
 * A reusable card component to display exercise information in the GymPage
 * Features:
 * - Clean, modern design with Israeli flag-inspired color scheme
 * - Displays exercise image, name, category, equipment, and muscle groups
 * - Provides "Add to Workout" button functionality
 */
const ExerciseCard = ({ exercise, onAddToWorkout }) => {
  // Handle adding exercise to workout
  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWorkout(exercise);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-200">
      {/* Exercise Image */}
      <div 
        className="h-48 bg-gray-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${exercise.imagePath || '/images/exercises/placeholder.jpg'})` }}
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-50 bg-opacity-10 hover:bg-opacity-30 transition-all duration-300">
          {/* Hover overlay with subtle effect */}
        </div>
      </div>
      
      {/* Exercise Information */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Exercise Name */}
        <h3 className="font-bold text-lg mb-2 text-gray-800">{exercise.name}</h3>
        
        {/* Category & Equipment */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
            {exercise.category}
          </span>
          <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
            {exercise.equipment}
          </span>
        </div>
        
        {/* Muscle Groups */}
        <div className="text-sm text-gray-600 mb-4 flex-grow">
          <div><span className="font-medium">Primary:</span> {exercise.targetMuscleGroup}</div>
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div><span className="font-medium">Secondary:</span> {exercise.secondaryMuscles.join(', ')}</div>
          )}
        </div>
        
        {/* Add to Workout Button */}
        <button
          onClick={handleAddClick}
          className="w-full mt-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add to Workout
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;