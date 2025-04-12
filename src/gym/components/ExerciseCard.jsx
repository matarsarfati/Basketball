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
        className="h-48 bg-gray-100 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${exercise.imagePath || '/images/exercises/placeholder.jpg'})` }}
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-50 bg-opacity-10 hover:bg-opacity-30 transition-all duration-300">
          {/* Hover overlay with subtle effect */}
        </div>
        
        {/* Category Tag */}
        <div className="absolute top-2 right-2 bg-israel-blue text-white text-xs py-1 px-2 rounded-full">
          {exercise.category}
        </div>
      </div>
      
      {/* Exercise Information */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Exercise Name */}
        <h3 className="font-bold text-lg mb-2 text-gray-800">{exercise.name}</h3>
        
        {/* Equipment Tag */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-200">
            {exercise.equipment}
          </span>
        </div>
        
        {/* Muscle Groups */}
        <div className="text-sm text-gray-600 mb-4 flex-grow">
          <div className="mb-1">
            <span className="inline-block w-16 font-medium">Primary:</span> 
            <span className="text-israel-blue font-medium">{exercise.targetMuscleGroup}</span>
          </div>
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div>
              <span className="inline-block w-16 font-medium">Secondary:</span> 
              <span>{exercise.secondaryMuscles.join(', ')}</span>
            </div>
          )}
        </div>
        
        {/* Add to Workout Button */}
        <button
          onClick={handleAddClick}
          className="w-full mt-auto px-4 py-2 bg-israel-blue text-white rounded-md hover:bg-israel-blue-dark transition-colors duration-200 flex items-center justify-center"
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