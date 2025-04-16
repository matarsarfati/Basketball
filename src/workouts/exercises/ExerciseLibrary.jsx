// Updates for ExerciseLibrary.jsx to make the main library view more compact
// Assuming you have a component structure similar to what's shown in Image 1

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import exerciseData, { getAllMuscleGroups, getAllCategories } from './exerciseData';
import { useWorkoutContext } from '../../context/WorkoutContext';

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const { setPendingExercise } = useWorkoutContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredExercises, setFilteredExercises] = useState(exerciseData);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter exercises when category changes
  useEffect(() => {
    let result = [...exerciseData];
    
    // Apply category filter
    if (activeCategory !== 'All') {
      if (activeCategory.includes(' - ')) {
        // Handle subcategories like "Core - Core"
        const [mainCategory, subCategory] = activeCategory.split(' - ');
        result = result.filter(ex => 
          ex.category === mainCategory && 
          (ex.subCategory === subCategory || !ex.subCategory)
        );
      } else {
        // Main category filter
        result = result.filter(ex => ex.category === activeCategory);
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(query) ||
        ex.targetMuscleGroup.toLowerCase().includes(query) ||
        (ex.description && ex.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredExercises(result);
  }, [activeCategory, searchQuery]);

  // Group exercises by subcategory for the current view
  const groupedExercises = filteredExercises.reduce((acc, exercise) => {
    // Generate a grouping key
    let groupKey;
    
    if (activeCategory === 'All') {
      // On "All" view, group by main category
      groupKey = exercise.category;
    } else if (activeCategory.includes(' - ')) {
      // On subcategory view, no additional grouping
      groupKey = exercise.category + (exercise.subCategory ? ` - ${exercise.subCategory}` : '');
    } else {
      // On main category view, group by subcategory if it exists
      groupKey = exercise.category + (exercise.subCategory ? ` - ${exercise.subCategory}` : '');
    }
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    
    acc[groupKey].push(exercise);
    return acc;
  }, {});

  const handleAddToWorkout = (exercise) => {
    setPendingExercise(exercise);
    navigate('/workout/planner');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Exercise Library</h1>
        <Link 
          to="/workout/planner" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Workout
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveCategory('All')}
            className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
              activeCategory === 'All'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          
          {getAllCategories().map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                activeCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Exercise Groups */}
      {Object.entries(groupedExercises).map(([groupName, exercises]) => (
        <div key={groupName} className="mb-8">
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2`}>
              {groupName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{groupName}</h2>
          </div>
          
          {/* Exercise Grid - COMPACT VERSION */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {exercises.map(exercise => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Compact Image Container */}
                <div className="h-24 bg-gray-50 flex justify-center items-center p-2">
                  <img 
                    src={exercise.imagePath}
                    alt={exercise.name}
                    className="h-20 w-auto object-contain max-w-full"
                  />
                </div>
                
                {/* Exercise Details */}
                <div className="p-2">
                  <h3 className="font-medium text-sm mb-1">{exercise.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                      {exercise.targetMuscleGroup}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full">
                      {exercise.category}
                    </span>
                  </div>
                  
                  {/* Add to Workout Button */}
                  <button
                    onClick={() => handleAddToWorkout(exercise)}
                    className="w-full text-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Add to Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No exercises found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;