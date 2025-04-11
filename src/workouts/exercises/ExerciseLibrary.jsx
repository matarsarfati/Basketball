import React, { useState, useEffect } from 'react';
import exerciseData, { 
  getAllMuscleGroups, 
  getAllCategories, 
  getAllEquipment 
} from './exerciseData';

/**
 * ExerciseLibrary Component
 * 
 * Displays a filterable, searchable library of exercises
 * Features:
 * - Filter by muscle group, category, and equipment
 * - Search by exercise name
 * - Responsive card layout for exercise information
 * - Detailed view for selected exercises
 */
const ExerciseLibrary = ({ onSelectExercise }) => {
  // State for filters
  const [filters, setFilters] = useState({
    muscleGroup: '',
    category: '',
    equipment: '',
    searchQuery: ''
  });
  
  // State for filtered exercises
  const [filteredExercises, setFilteredExercises] = useState(exerciseData);
  
  // State for detailed view of an exercise
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Get all available filter options
  const muscleGroups = getAllMuscleGroups();
  const categories = getAllCategories();
  const equipmentTypes = getAllEquipment();
  
  // Apply filters whenever they change
  useEffect(() => {
    const result = exerciseData.filter(exercise => {
      // Filter by muscle group (check both primary and secondary)
      const matchesMuscle = !filters.muscleGroup || 
        exercise.targetMuscleGroup === filters.muscleGroup ||
        (exercise.secondaryMuscles && exercise.secondaryMuscles.includes(filters.muscleGroup));
      
      // Filter by category
      const matchesCategory = !filters.category || exercise.category === filters.category;
      
      // Filter by equipment
      const matchesEquipment = !filters.equipment || exercise.equipment === filters.equipment;
      
      // Filter by search query
      const matchesSearch = !filters.searchQuery || 
        exercise.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesMuscle && matchesCategory && matchesEquipment && matchesSearch;
    });
    
    setFilteredExercises(result);
  }, [filters]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      muscleGroup: '',
      category: '',
      equipment: '',
      searchQuery: ''
    });
  };
  
  // Handle selecting an exercise for detailed view
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };
  
  // Handle adding exercise to workout
  const handleAddToWorkout = (exercise) => {
    if (onSelectExercise) {
      onSelectExercise(exercise);
    } else {
      console.log('Exercise selected:', exercise.name);
      // In standalone mode, just show a message
      alert(`Added ${exercise.name} to workout`);
    }
  };
  
  // Close detailed view
  const closeDetailView = () => {
    setSelectedExercise(null);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Exercise Library</h2>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search exercises..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Muscle Group Filter */}
          <div>
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Muscle Group
            </label>
            <select
              id="muscleGroup"
              name="muscleGroup"
              value={filters.muscleGroup}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Equipment Filter */}
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
              Equipment
            </label>
            <select
              id="equipment"
              name="equipment"
              value={filters.equipment}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Equipment</option>
              {equipmentTypes.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="mt-4 text-right">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredExercises.length} of {exerciseData.length} exercises
        </p>
      </div>
      
      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div 
            key={exercise.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Exercise Image */}
            <div 
              className="h-48 bg-gray-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${exercise.imagePath || '/images/exercises/placeholder.jpg'})` }}
            >
              {/* Fallback if image doesn't load */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-80 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-gray-800 font-medium">{exercise.name}</span>
              </div>
            </div>
            
            {/* Exercise Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{exercise.name}</h3>
              
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  {exercise.targetMuscleGroup}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  {exercise.category}
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-1">
                  {exercise.equipment}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {exercise.description}
              </p>
              
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleExerciseClick(exercise)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
                
                <button
                  onClick={() => handleAddToWorkout(exercise)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded-md"
                >
                  Add to Workout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* No Results Message */}
      {filteredExercises.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No exercises match your current filters.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {/* Detailed Exercise View Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
                <button
                  onClick={closeDetailView}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div 
                  className="h-64 bg-gray-200 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${selectedExercise.imagePath || '/images/exercises/placeholder.jpg'})` }}
                ></div>
                
                {/* Exercise Details */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Target Areas</h3>
                    <p>
                      <span className="font-medium">Primary:</span> {selectedExercise.targetMuscleGroup}
                    </p>
                    {selectedExercise.secondaryMuscles && selectedExercise.secondaryMuscles.length > 0 && (
                      <p>
                        <span className="font-medium">Secondary:</span> {selectedExercise.secondaryMuscles.join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Classification</h3>
                    <p>
                      <span className="font-medium">Category:</span> {selectedExercise.category}
                    </p>
                    <p>
                      <span className="font-medium">Equipment:</span> {selectedExercise.equipment}
                    </p>
                    <p>
                      <span className="font-medium">Base Intensity Factor:</span> {selectedExercise.baseIntensityFactor}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedExercise.description}</p>
              </div>
              
              {/* Instructions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedExercise.instructions.split('\n').map((step, index) => (
                    <p key={index} className="mb-2">{step}</p>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              {selectedExercise.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Coaching Notes</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-gray-700">{selectedExercise.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeDetailView}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-4 hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAddToWorkout(selectedExercise);
                    closeDetailView();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add to Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;