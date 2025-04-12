// Path: src/gym/GymPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exerciseData, { getAllMuscleGroups } from '../workouts/exercises/exerciseData';
import { useWorkoutContext } from '../context/WorkoutContext';
import ExerciseCard from './components/ExerciseCard';

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
  const handleAddToWorkout = (exercise) => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Exercise Library</h1>
      
      {/* Muscle Group Sections */}
      {muscleGroups.map(muscleGroup => (
        <div key={muscleGroup} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b-2 border-blue-400 pb-2 text-gray-700">
            {getRegionForMuscle(muscleGroup)} - {muscleGroup}
          </h2>
          
          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedExercises[muscleGroup].map(exercise => (
              <div 
                key={`${exercise.id}-${muscleGroup}`}
                className={exercise.isSecondary ? 'border-l-4 border-blue-400' : ''}
              >
                <ExerciseCard 
                  exercise={exercise} 
                  onAddToWorkout={handleAddToWorkout} 
                />
                
                {/* Secondary muscle indicator */}
                {exercise.isSecondary && (
                  <div className="mt-1 text-xs text-blue-600 font-medium px-2">
                    Secondary target muscle
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GymPage;