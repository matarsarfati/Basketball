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
 * - Exercises organized by target muscle groups using Israel-inspired colors
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
  
  // State for active region filter
  const [activeRegion, setActiveRegion] = useState('All');
  
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
  
  // Get all unique regions
  const getAllRegions = () => {
    const regions = new Set();
    Object.keys(groupedExercises).forEach(muscle => {
      regions.add(getRegionForMuscle(muscle));
    });
    return ['All', ...Array.from(regions)];
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
  }).filter(muscle => 
    activeRegion === 'All' || getRegionForMuscle(muscle) === activeRegion
  );
  
  // Get the regions for tabs
  const regions = getAllRegions();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-israel-blue mb-4 md:mb-0">Exercise Library</h1>
        
        <button 
          onClick={() => navigate('/workouts')}
          className="bg-israel-blue hover:bg-israel-blue-dark text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Workout
        </button>
      </div>
      
      {/* Region Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="inline-flex border-b border-gray-200 w-full">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeRegion === region
                  ? 'border-b-2 border-israel-blue text-israel-blue'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
      
      {/* Muscle Group Sections */}
      {muscleGroups.map(muscleGroup => (
        <div key={muscleGroup} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b-2 border-israel-blue pb-2 text-gray-700 flex items-center">
            <span className="bg-israel-blue text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm">
              {muscleGroup.charAt(0)}
            </span>
            <span>{getRegionForMuscle(muscleGroup)} - {muscleGroup}</span>
          </h2>
          
          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedExercises[muscleGroup].map(exercise => (
              <div 
                key={`${exercise.id}-${muscleGroup}`}
                className={exercise.isSecondary ? 'border-l-4 border-israel-blue' : ''}
              >
                <ExerciseCard 
                  exercise={exercise} 
                  onAddToWorkout={handleAddToWorkout} 
                />
                
                {/* Secondary muscle indicator */}
                {exercise.isSecondary && (
                  <div className="mt-1 text-xs text-israel-blue font-medium px-2">
                    Secondary target muscle
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Empty state if no muscle groups match the filter */}
      {muscleGroups.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No exercises found for the selected region.</p>
          <button
            onClick={() => setActiveRegion('All')}
            className="px-4 py-2 bg-israel-blue text-white rounded-lg hover:bg-israel-blue-dark"
          >
            View All Exercises
          </button>
        </div>
      )}
    </div>
  );
};

export default GymPage;