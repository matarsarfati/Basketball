import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exerciseData, { getAllMuscleGroups } from '../workouts/exercises/exerciseData';
import { useWorkoutContext } from '../context/WorkoutContext';

/**
 * GymPage Component
 * 
 * Displays exercises grouped by muscle group in a clean, visual layout.
 * Features:
 * - Exercises organized by target muscle groups
 * - Visual cards with images for each exercise
 * - "Add to Workout" button to directly add exercises to the workout planner
 */
const GymPage = () => {
  // Navigation hook for redirecting to workouts page
  const navigate = useNavigate();
  
  // Access workout context for adding exercises
  const { addExerciseToPending } = useWorkoutContext();
  
  // State to store exercises grouped by muscle
  const [groupedExercises, setGroupedExercises] = useState({});
  
  // On component mount, group exercises by muscle
  useEffect(() => {
    // Create a map of muscle groups to exercises
    const muscleGroups = {};
    
    // Process each exercise
    exerciseData.forEach(exercise => {
      const mainMuscle = exercise.targetMuscleGroup;
      
      // Initialize the array if this is the first exercise for this muscle
      if (!muscleGroups[mainMuscle]) {
        muscleGroups[mainMuscle] = [];
      }
      
      // Add exercise to the appropriate muscle group
      muscleGroups[mainMuscle].push(exercise);
      
      // Also include in secondary muscle groups
      if (exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0) {
        exercise.secondaryMuscles.forEach(secondaryMuscle => {
          if (!muscleGroups[secondaryMuscle]) {
            muscleGroups[secondaryMuscle] = [];
          }
          
          // Avoid duplicates
          if (!muscleGroups[secondaryMuscle].some(ex => ex.id === exercise.id)) {
            muscleGroups[secondaryMuscle].push({
              ...exercise,
              isSecondary: true // Mark as secondary target
            });
          }
        });
      }
    });
    
    // Sort by name within each group
    Object.keys(muscleGroups).forEach(muscleGroup => {
      muscleGroups[muscleGroup].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    setGroupedExercises(muscleGroups);
  }, []);

  // Helper function to group by anatomical region
  const getRegionForMuscle = (muscle) => {
    // Map muscle groups to body regions
    const muscleRegionMap = {
      // Lower body
      'Quadriceps': 'Legs',
      'Hamstrings': 'Legs',
      'Glutes': 'Legs',
      'Calves': 'Legs',
      // Upper body - push
      'Chest': 'Upper Body - Push',
      'Shoulders': 'Upper Body - Push',
      'Triceps': 'Upper Body - Push',
      // Upper body - pull
      'Back': 'Upper Body - Pull',
      'Biceps': 'Upper Body - Pull',
      'Forearms': 'Upper Body - Pull',
      // Core
      'Core': 'Core',
      'Obliques': 'Core',
      'Lower Back': 'Core',
      // Other
      'Hip Flexors': 'Hip & Mobility',
      'Ankles': 'Hip & Mobility',
      'Full Body': 'Full Body'
    };
    
    return muscleRegionMap[muscle] || 'Other';
  };
  
  // Handle adding exercise to workout
  const handleAddToWorkout = (exercise, event) => {
    // Prevent event bubbling (if inside a clickable card)
    event.stopPropagation();
    
    // Add exercise to pending in context
    addExerciseToPending(exercise);
    
    // Navigate to workout planner
    navigate('/workouts');
  };
  
  // Organize muscle groups by region
  const muscleGroups = Object.keys(groupedExercises).sort((a, b) => {
    // First sort by region
    const regionA = getRegionForMuscle(a);
    const regionB = getRegionForMuscle(b);
    
    if (regionA !== regionB) {
      return regionA.localeCompare(regionB);
    }
    
    // Then sort by muscle name
    return a.localeCompare(b);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Exercise Library</h1>
      
      {/* Muscle Group Sections */}
      {muscleGroups.map(muscleGroup => (
        <div key={muscleGroup} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
            {getRegionForMuscle(muscleGroup)} - {muscleGroup}
          </h2>
          
          {/* Scrollable Exercise Cards */}
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {groupedExercises[muscleGroup].map(exercise => (
              <div 
                key={`${exercise.id}-${muscleGroup}`} 
                className={`flex-none w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  exercise.isSecondary ? 'border-l-4 border-blue-400' : ''
                }`}
              >
                {/* Exercise Image */}
                <div 
                  className="h-40 bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${exercise.imagePath})` }}
                >
                  {/* Fallback if image doesn't load */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-gray-800 font-medium p-2 text-center">{exercise.name}</span>
                  </div>
                </div>
                
                {/* Exercise Name and Info */}
                <div className="p-3">
                  <h3 className="font-bold text-lg mb-1 truncate">{exercise.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {exercise.category}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full truncate">
                      {exercise.equipment}
                    </span>
                  </div>
                  
                  {exercise.isSecondary && (
                    <p className="text-xs text-gray-500 italic mb-2">Secondary target muscle</p>
                  )}
                  
                  {/* Add to Workout Button */}
                  <button
                    onClick={(e) => handleAddToWorkout(exercise, e)}
                    className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add to Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GymPage;