import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import exerciseData, { getAllMuscleGroups, getAllCategories } from '../exercises/exerciseData';
import mockPlayers from '../../players/mockPlayers';
import { useWorkoutContext } from '../../context/WorkoutContext';
import WorkoutPerformModal from './WorkoutPerformModal';

/**
 * WorkoutPlanner Component
 * 
 * A flexible workout planner that supports:
 * - Block-based organization with multiple exercises per block
 * - Integration with GymPage for direct exercise adding
 * - Saving and loading workout plans
 * - Recording actual workout performance
 */
const WorkoutPlanner = () => {
  // Navigation hook
  const navigate = useNavigate();
  
  // Get available filter options from exercise data
  const muscleGroups = getAllMuscleGroups();
  const categories = getAllCategories();
  
  // Access workout context
  const { 
    pendingExercise, 
    clearPendingExercise, 
    showToast,
    saveWorkoutPlan,
    loadedPlan,
    clearLoadedPlan
  } = useWorkoutContext();
  
  // Refs for save modal
  const saveModalRef = useRef(null);
  const saveNameInputRef = useRef(null);
  
  // Selected player state
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Exercise library modal state
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const [exerciseFilters, setExerciseFilters] = useState({
    muscleGroup: '',
    category: '',
    searchQuery: ''
  });
  
  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPerformModal, setShowPerformModal] = useState(false);
  
  // Filtered exercises for the library modal
  const [filteredExercises, setFilteredExercises] = useState(exerciseData);
  
// New function to convert intensity (1-10) to %1RM
// Updated function that handles all intensity values 1-10
const intensityToPercentRM = (intensity) => {
  // Basketball-specific mapping (1-7)
  const basketballMap = {
    1: { percent: 0.4, repsLow: 8, repsHigh: 10, sets: 1 },   // Very light - technique focus
    2: { percent: 0.45, repsLow: 7, repsHigh: 10, sets: 2 },  // Light 
    3: { percent: 0.5, repsLow: 6, repsHigh: 8, sets: 2 },    // Light-moderate
    4: { percent: 0.55, repsLow: 6, repsHigh: 8, sets: 3 },   // Moderate
    5: { percent: 0.6, repsLow: 5, repsHigh: 7, sets: 3 },    // Moderate-high
    6: { percent: 0.65, repsLow: 4, repsHigh: 6, sets: 3 },   // High
    7: { percent: 0.7, repsLow: 4, repsHigh: 6, sets: 3 }     // Very high (for pre-practice)
  };
  
  // Strength-specific mapping (8-10)
  const strengthMap = {
    8: { percent: 0.8, repsLow: 3, repsHigh: 5, sets: 4 },    // Heavy strength work
    9: { percent: 0.85, repsLow: 2, repsHigh: 4, sets: 5 },   // Very heavy strength
    10: { percent: 0.9, repsLow: 1, repsHigh: 3, sets: 5 }    // Near maximal strength
  };
  
  // Choose the appropriate map based on intensity level
  if (intensity <= 7) {
    return basketballMap[intensity] || basketballMap[4]; // Default to moderate
  } else {
    return strengthMap[intensity] || strengthMap[8]; // Default to heavy
  }
};

// Enhanced calculateWeight function
function calculateWeight(exerciseId, intensity = 5) {
  if (!selectedPlayer || !selectedPlayer.rmData) {
    return 0;
  }
  
  const { percent } = intensityToPercentRM(intensity);
  let rmValue = 0;
  let transferCoefficient = 1.0;
  
  // Define exercise relationships and coefficients
  const exerciseRelationships = {
    // Squat-related
    'leg-press': { baseExercise: 'squat', coefficient: 0.9 },
    'lunges': { baseExercise: 'squat', coefficient: 0.7 },
    'bulgarian-split-squat': { baseExercise: 'squat', coefficient: 0.65 },
    'front-squat': { baseExercise: 'squat', coefficient: 0.85 },
    
    // Bench press-related
    'incline-bench-press': { baseExercise: 'benchPress', coefficient: 0.85 },
    'chest-fly': { baseExercise: 'benchPress', coefficient: 0.6 },
    'tricep-pushdown': { baseExercise: 'benchPress', coefficient: 0.5 },
    'overhead-press': { baseExercise: 'benchPress', coefficient: 0.7 },
    
    // Deadlift-related
    'romanian-deadlift': { baseExercise: 'deadlift', coefficient: 0.8 },
    'pull-ups': { baseExercise: 'deadlift', coefficient: 0.7 },
    'barbell-row': { baseExercise: 'deadlift', coefficient: 0.7 },
    'lat-pulldown': { baseExercise: 'deadlift', coefficient: 0.65 }
  };
  
  // Direct mapping
  if (exerciseId === 'back-squat') {
    rmValue = selectedPlayer.rmData.squat || 0;
  } else if (exerciseId === 'bench-press') {
    rmValue = selectedPlayer.rmData.benchPress || 0;
  } else if (exerciseId === 'deadlift') {
    rmValue = selectedPlayer.rmData.deadlift || 0;
  }
  // Check relationship mapping
  else if (exerciseRelationships[exerciseId]) {
    const relationship = exerciseRelationships[exerciseId];
    rmValue = selectedPlayer.rmData[relationship.baseExercise] || 0;
    transferCoefficient = relationship.coefficient;
  }
  // Fallback to muscle group estimation
  else {
    // Existing code for general exercise estimation
    if (exerciseId.includes('chest') || exerciseId.includes('tricep') || 
        exerciseId.includes('shoulder') || exerciseId.includes('press')) {
      rmValue = selectedPlayer.rmData.benchPress || 0;
      transferCoefficient = 0.7; // Generic transfer coefficient
    } else if (exerciseId.includes('quad') || exerciseId.includes('leg')) {
      rmValue = selectedPlayer.rmData.squat || 0;
      transferCoefficient = 0.7;
    } else if (exerciseId.includes('back') || exerciseId.includes('hamstring') || 
              exerciseId.includes('glute')) {
      rmValue = selectedPlayer.rmData.deadlift || 0;
      transferCoefficient = 0.7;
    }
  }
  
  // Calculate weight based on RM, transfer coefficient, and intensity percentage
  const calculatedWeight = (rmValue * transferCoefficient * percent);
  
  // Round to nearest 2.5 kg
  return Math.round(calculatedWeight / 2.5) * 2.5;
}

  // Workout plan state with flexible blocks
  const [workoutPlan, setWorkoutPlan] = useState({
    id: Date.now().toString(),
    name: '',
    description: '',
    targetDate: new Date().toISOString().split('T')[0],
    intensity: 5,
    blocks: [] // Each block contains exercises (no muscle group restriction)
  });
  
  // Check if we're in edit mode (loaded an existing plan)
  const isEditMode = Boolean(workoutPlan.id && workoutPlan.createdAt);
  
  // Update selected player when ID changes
  useEffect(() => {
    if (selectedPlayerId) {
      const player = mockPlayers.find(p => p.id === selectedPlayerId);
      setSelectedPlayer(player);
      
      // If we have a loaded plan, don't reset
      if (!loadedPlan) {
        // Reset workout plan when player changes
        setWorkoutPlan({
          id: Date.now().toString(),
          name: `${player?.name}'s Workout`,
          description: '',
          targetDate: new Date().toISOString().split('T')[0],
          blocks: []
        });
      }
    }
  }, [selectedPlayerId]);
  
  // Handle loading a saved plan
  useEffect(() => {
    if (loadedPlan) {
      // Load the plan data
      setWorkoutPlan(loadedPlan);
      
      // Set the player ID
      setSelectedPlayerId(loadedPlan.playerId);
      
      // Clear the loaded plan so we don't reload it if we navigate away and back
      clearLoadedPlan();
    }
  }, [loadedPlan, clearLoadedPlan]);
  
  // Apply filters to exercises
  useEffect(() => {
    const result = exerciseData.filter(exercise => {
      // Filter by muscle group (check both primary and secondary)
      const matchesMuscle = !exerciseFilters.muscleGroup || 
        exercise.targetMuscleGroup === exerciseFilters.muscleGroup ||
        (exercise.secondaryMuscles && exercise.secondaryMuscles.includes(exerciseFilters.muscleGroup));
      
      // Filter by category
      const matchesCategory = !exerciseFilters.category || 
        exercise.category === exerciseFilters.category;
      
      // Filter by search query
      const matchesSearch = !exerciseFilters.searchQuery || 
        exercise.name.toLowerCase().includes(exerciseFilters.searchQuery.toLowerCase()) ||
        (exercise.description && exercise.description.toLowerCase().includes(exerciseFilters.searchQuery.toLowerCase()));
      
      return matchesMuscle && matchesCategory && matchesSearch;
    });
    
    setFilteredExercises(result);
  }, [exerciseFilters]);
  
  // Handle the pending exercise from GymPage
  useEffect(() => {
    if (pendingExercise && selectedPlayer) {
      // Check if there's at least one block to add the exercise to
      if (workoutPlan.blocks.length === 0) {
        // Create a new block if none exists
        const newBlock = {
          id: `block-${Date.now()}`,
          title: `Block 1`,
          description: '',
          exercises: []
        };
        
        // Add block to workout plan
        setWorkoutPlan(prev => ({
          ...prev,
          blocks: [...prev.blocks, newBlock]
        }));
        
        // Then add the exercise to this block (in a separate effect)
        setTimeout(() => {
          addExerciseToBlock(newBlock.id, pendingExercise);
          clearPendingExercise();
        }, 0);
      } else {
        // Add to the most recent block
        const lastBlockId = workoutPlan.blocks[workoutPlan.blocks.length - 1].id;
        addExerciseToBlock(lastBlockId, pendingExercise);
        clearPendingExercise();
      }
    }
  }, [pendingExercise, selectedPlayer, workoutPlan.blocks.length, clearPendingExercise]);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (saveModalRef.current && !saveModalRef.current.contains(event.target)) {
        setShowSaveModal(false);
      }
    }
    
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [saveModalRef]);
  
  // Focus on input when save modal opens
  useEffect(() => {
    if (showSaveModal && saveNameInputRef.current) {
      setTimeout(() => {
        saveNameInputRef.current.focus();
      }, 100);
    }
  }, [showSaveModal]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setExerciseFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setExerciseFilters({
      muscleGroup: '',
      category: '',
      searchQuery: ''
    });
  };
  
  // Handle workout details change
  const handleWorkoutDetailsChange = (e) => {
    const { name, value } = e.target;
    setWorkoutPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Add this function to generate a template workout
const generateTemplateWorkout = () => {
  if (!selectedPlayer) {
    showToast('Please select a player first', 'error');
    return;
  }
  
  const intensity = workoutPlan.intensity || 5; // Default to medium intensity if not set
  const { sets, repsLow, repsHigh } = intensityToPercentRM(intensity);
  const reps = Math.floor((repsLow + repsHigh) / 2);
  
  // Create blocks based on intensity and player data
  const newBlocks = [];
  
  // 1. Warm-up block
  const warmupBlock = {
    id: `block-${Date.now()}-warmup`,
    title: `Warm-up`,
    description: 'Dynamic stretches and movement preparation',
    exercises: []
  };
  
  // 2. Main strength block - choose exercises based on player data and intensity
  const mainBlock = {
    id: `block-${Date.now()}-main`,
    title: `Main Strength (Intensity: ${intensity}/10)`,
    description: 'Primary compound movements',
    exercises: []
  };
  
  // 3. Accessory work
  const accessoryBlock = {
    id: `block-${Date.now()}-accessory`,
    title: `Accessory Work`,
    description: 'Supporting exercises for main lifts',
    exercises: []
  };
  
  // Add blocks to workout plan
  newBlocks.push(warmupBlock, mainBlock, accessoryBlock);
  
  // Populate with exercises based on the player's strongest lifts
  const playerData = selectedPlayer.rmData;
  
  // Determine focus based on player's strongest lift
  let focusLift = 'balanced';
  if (playerData.squat > playerData.benchPress && playerData.squat > playerData.deadlift) {
    focusLift = 'squat';
  } else if (playerData.benchPress > playerData.squat && playerData.benchPress > playerData.deadlift) {
    focusLift = 'benchPress';
  } else if (playerData.deadlift > playerData.squat && playerData.deadlift > playerData.benchPress) {
    focusLift = 'deadlift';
  }
  
  // Add warm-up exercises
  const warmupExercises = ['jump-squats', 'lunges', 'wall-sit'];
  warmupExercises.forEach(exId => {
    const exercise = exerciseData.find(ex => ex.id === exId);
    if (exercise) {
      warmupBlock.exercises.push({
        id: `${exercise.id}-${Date.now()}-warmup`,
        exerciseId: exercise.id,
        name: exercise.name,
        imagePath: exercise.imagePath,
        category: exercise.category,
        targetMuscleGroup: exercise.targetMuscleGroup,
        sets: 2, // Fewer sets for warm-up
        reps: 10, // Higher reps for warm-up
        weight: calculateWeight(exercise.id, Math.max(1, intensity - 3)), // Much lower intensity for warm-up
        notes: 'Warm-up exercise, focus on form and mobility',
      });
    }
  });
  
  // Add appropriate main exercises
  if (focusLift === 'squat' || focusLift === 'balanced') {
    // Add squat as main exercise
    const squatExercise = exerciseData.find(ex => ex.id === 'back-squat');
    if (squatExercise) {
      mainBlock.exercises.push({
        id: `${squatExercise.id}-${Date.now()}`,
        exerciseId: squatExercise.id,
        name: squatExercise.name,
        imagePath: squatExercise.imagePath,
        category: squatExercise.category,
        targetMuscleGroup: squatExercise.targetMuscleGroup,
        sets: sets,
        reps: reps,
        weight: calculateWeight(squatExercise.id, intensity),
        notes: `Primary compound movement at intensity ${intensity <= 7 ? intensity + '/7' : intensity + '/10'}`,
      });
    }
  }
  
  // Add bench press exercise
  if (focusLift === 'benchPress' || focusLift === 'balanced') {
    const benchExercise = exerciseData.find(ex => ex.id === 'bench-press');
    if (benchExercise) {
      mainBlock.exercises.push({
        id: `${benchExercise.id}-${Date.now()}`,
        exerciseId: benchExercise.id,
        name: benchExercise.name,
        imagePath: benchExercise.imagePath,
        category: benchExercise.category,
        targetMuscleGroup: benchExercise.targetMuscleGroup,
        sets: sets,
        reps: reps,
        weight: calculateWeight(benchExercise.id, intensity),
        notes: `Primary compound movement at intensity ${intensity}/10`,
      });
    }
  }
  
  // Add deadlift exercise
  if (focusLift === 'deadlift' || focusLift === 'balanced') {
    const deadliftExercise = exerciseData.find(ex => ex.id === 'deadlift');
    if (deadliftExercise) {
      mainBlock.exercises.push({
        id: `${deadliftExercise.id}-${Date.now()}`,
        exerciseId: deadliftExercise.id,
        name: deadliftExercise.name,
        imagePath: deadliftExercise.imagePath,
        category: deadliftExercise.category,
        targetMuscleGroup: deadliftExercise.targetMuscleGroup,
        sets: sets,
        reps: reps,
        weight: calculateWeight(deadliftExercise.id, intensity),
        notes: `Primary compound movement at intensity ${intensity}/10`,
      });
    }
  }
  
  // Add accessory exercises
  const accessoryExercises = ['lat-pulldown', 'tricep-pushdown', 'romanian-deadlift', 'incline-bench-press'];
  accessoryExercises.forEach(exId => {
    const exercise = exerciseData.find(ex => ex.id === exId);
    if (exercise) {
      accessoryBlock.exercises.push({
        id: `${exercise.id}-${Date.now()}`,
        exerciseId: exercise.id,
        name: exercise.name,
        imagePath: exercise.imagePath,
        category: exercise.category,
        targetMuscleGroup: exercise.targetMuscleGroup,
        sets: Math.max(2, sets - 1), // Slightly fewer sets for accessories
        reps: reps + 2, // Slightly higher reps for accessories
        weight: calculateWeight(exercise.id, Math.max(1, intensity - 1)), // Slightly lower intensity for accessories
        notes: `Accessory exercise at intensity ${intensity-1}/10`,
      });
    }
  });
  
  // Update the workout plan
  setWorkoutPlan(prev => ({
    ...prev,
    blocks: newBlocks
  }));
  
  showToast(`Generated workout at intensity level ${intensity}/10`, 'success');
};


  // Add a new exercise block
  const addExerciseBlock = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      title: `Block ${workoutPlan.blocks.length + 1}`,
      description: '',
      exercises: []
    };
    
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };
  
  // Update block title or description
  const updateBlockDetails = (blockId, field, value) => {
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, [field]: value } : block
      )
    }));
  };
  
  // Remove an exercise block
  const removeBlock = (blockId) => {
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };
  
  // Open exercise library for a specific block
  const openExerciseLibrary = (blockId) => {
    setCurrentBlockId(blockId);
    setShowExerciseLibrary(true);
    clearFilters(); // Reset filters when opening
  };
  
  // Generate a random exercise 
  const generateRandomExercise = (blockId, filterType = null, filterValue = null) => {
    // Get the current block
    const currentBlock = workoutPlan.blocks.find(block => block.id === blockId);
    if (!currentBlock) return;
    
    // Get current exercise IDs in this block
    const currentExerciseIds = currentBlock.exercises.map(ex => ex.exerciseId);
    
    // Get exercises based on optional filter
    let eligibleExercises = [...exerciseData];
    
    if (filterType && filterValue) {
      if (filterType === 'muscleGroup') {
        eligibleExercises = exerciseData.filter(ex => 
          ex.targetMuscleGroup === filterValue || 
          (ex.secondaryMuscles && ex.secondaryMuscles.includes(filterValue))
        );
      } else if (filterType === 'category') {
        eligibleExercises = exerciseData.filter(ex => ex.category === filterValue);
      }
    }
// Filter out exercises that are already in the block
eligibleExercises = eligibleExercises.filter(ex => !currentExerciseIds.includes(ex.id));

// Check if there are any eligible exercises left
if (eligibleExercises.length === 0) {
  showToast('No new exercises found matching the selected criteria', 'error');
  return;
}

const randomIndex = Math.floor(Math.random() * eligibleExercises.length);
const selectedExercise = eligibleExercises[randomIndex];
// Add the exercise to the block without duplicate checking
addExerciseToBlockDirectly(blockId, selectedExercise);
};

// Check if exercise already exists in the block
const isDuplicateExercise = (blockId, exerciseId) => {
const block = workoutPlan.blocks.find(block => block.id === blockId);
if (!block) return false;
return block.exercises.some(ex => ex.exerciseId === exerciseId);
};

// Add a specific exercise to a block
const addExerciseToBlock = (blockId, exercise) => {
  // Check for duplicates if needed
  if (isDuplicateExercise(blockId, exercise.id)) {
    // Ask user if they want to add a duplicate
    const confirmAdd = window.confirm(
      `${exercise.name} is already in this block. Add another?`
    );
    
    if (!confirmAdd) return;
  }
  
  // Use the direct add function
  addExerciseToBlockDirectly(blockId, exercise);
};

// Enhanced addExerciseToBlock function that considers workout intensity
const addExerciseToBlockDirectly = (blockId, exercise) => {
 const currentIntensity = workoutPlan.intensity || 4;
 const { sets, repsLow, repsHigh } = intensityToPercentRM(currentIntensity);
 const reps = Math.floor((repsLow + repsHigh) / 2);
  
  const newExercise = {
    id: `${exercise.id}-${Date.now()}`,
    exerciseId: exercise.id,
    name: exercise.name,
    imagePath: exercise.imagePath,
    category: exercise.category,
    targetMuscleGroup: exercise.targetMuscleGroup,
    sets: sets,
    reps: reps,
    weight: calculateWeight(exercise.id, currentIntensity),
    notes: `Added with intensity level: ${currentIntensity}/7`,
  };
  
  setWorkoutPlan(prev => ({
    ...prev,
    blocks: prev.blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          exercises: [...block.exercises, newExercise]
        };
      }
      return block;
    })
  }));
  
  if (showExerciseLibrary) {
    setShowExerciseLibrary(false);
    setCurrentBlockId(null);
  }
};
  
  // Remove an exercise from a block
  const removeExercise = (blockId, exerciseId) => {
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            exercises: block.exercises.filter(ex => ex.id !== exerciseId)
          };
        }
        return block;
      })
    }));
  };
  
  // Update exercise parameters (sets, reps, weight)
  const updateExercise = (blockId, exerciseId, field, value) => {
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            exercises: block.exercises.map(ex => {
              if (ex.id === exerciseId) {
                return { ...ex, [field]: value };
              }
              return ex;
            })
          };
        }
        return block;
      })
    }));
  };
  
  // Reorder exercises within a block (move up/down)
  const moveExercise = (blockId, currentIndex, direction) => {
    const block = workoutPlan.blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= block.exercises.length) return;
    
    const updatedExercises = [...block.exercises];
    const temp = updatedExercises[currentIndex];
    updatedExercises[currentIndex] = updatedExercises[newIndex];
    updatedExercises[newIndex] = temp;
    
    setWorkoutPlan(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, exercises: updatedExercises };
        }
        return b;
      })
    }));
  };
  
  // Open the save workout modal
  const openSaveModal = () => {
    if (!selectedPlayer) {
      showToast('Please select a player first', 'error');
      return;
    }
    
    if (workoutPlan.blocks.length === 0) {
      showToast('Please add at least one exercise block', 'error');
      return;
    }
    
    setShowSaveModal(true);
  };
  
  // Open the perform workout modal
  const openPerformModal = () => {
    // Only allow performing if the workout has been saved
    if (!isEditMode) {
      showToast('Please save the workout plan before recording performance', 'error');
      setShowSaveModal(true);
      return;
    }
    
    setShowPerformModal(true);
  };
  
  // Save the workout plan
  const handleSaveWorkout = (e) => {
    e.preventDefault();
    
    // If no name provided, use default
    if (!workoutPlan.name.trim()) {
      workoutPlan.name = `${selectedPlayer.name}'s Workout`;
    }
    
    // Prepare plan with player ID
    const planToSave = {
      ...workoutPlan,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      // Keep createdAt if it exists (editing mode), otherwise set new timestamp
      createdAt: workoutPlan.createdAt || new Date().toISOString()
    };
    
    // Save the plan
    const success = saveWorkoutPlan(planToSave);
    
    if (success) {
      setShowSaveModal(false);
      
      // In edit mode, stay on the page
      // In create mode, navigate back to player profile
      if (!isEditMode) {
        // Wait a moment for the toast to be visible before navigating
        setTimeout(() => {
          navigate(`/profile`);
        }, 1500);
      }
    }
  };
  
  // Count total exercises in the workout
  const getTotalExercises = () => {
    return workoutPlan.blocks.reduce((total, block) => total + block.exercises.length, 0);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? `Edit Workout: ${workoutPlan.name}` : 'Create New Workout'}
      </h1>
      
      {/* Performance Status Badge */}
      {isEditMode && workoutPlan.actualPerformance && (
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Performed on {new Date(workoutPlan.actualPerformance.date).toLocaleDateString()}
          </div>
        </div>
      )}
      
      {/* Player Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label htmlFor="playerSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Player:
        </label>
        <select
          id="playerSelect"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          disabled={isEditMode} // Disable changing player in edit mode
        >
          <option value="">-- Select a Player --</option>
          {mockPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name} - #{player.jerseyNumber} ({player.position})
            </option>
          ))}
        </select>
      </div>
      
      {/* Show content only when a player is selected */}
      {!selectedPlayer ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Please select a player to create a workout plan.</p>
        </div>
      ) : (
        <>
          {/* Workout Details Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-blue-700 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Workout Details</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={workoutPlan.name}
                    onChange={handleWorkoutDetailsChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Monday Workout, Game Day Prep, Recovery Session"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetDate"
                    value={workoutPlan.targetDate}
                    onChange={handleWorkoutDetailsChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={workoutPlan.description}
                    onChange={handleWorkoutDetailsChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the workout goals or focus areas..."
                  ></textarea>
                  <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Workout Intensity (1-10)
  </label>
  <div className="flex items-center">
    <span className="text-xs text-gray-500 mr-2">Easy</span>
    <input
      type="range"
      name="intensity"
      min="1"
      max="10"
      value={workoutPlan.intensity}
      onChange={handleWorkoutDetailsChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <span className="text-xs text-gray-500 ml-2">Hard</span>
  </div>
  <div className="text-center text-sm mt-1">
    {workoutPlan.intensity} - {workoutPlan.intensity <= 3 ? 'Light' : workoutPlan.intensity <= 7 ? 'Moderate' : 'Intense'}
  </div>
</div>
                </div>
              </div>
            </div>
          </div>
          
{/* Add Block and Auto-Generate Buttons */}
<div className="flex justify-center gap-4 mb-6">
  <button
    onClick={addExerciseBlock}
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
    Add Exercise Block
  </button>

  <button
    onClick={generateTemplateWorkout}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
    </svg>
    Auto-Generate Workout
  </button>
</div>

{/* Exercise Blocks */}
{workoutPlan.blocks.length === 0 ? (
  <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
    <p className="text-gray-600 mb-4">No exercise blocks added yet.</p>
    <button
      onClick={addExerciseBlock}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Start by adding an exercise block
    </button>
  </div>
) : (
  <div className="space-y-6 mb-6">
              {workoutPlan.blocks.map((block, blockIndex) => (
                <div key={block.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Block Header */}
                  <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => updateBlockDetails(block.id, 'title', e.target.value)}
                        className="bg-blue-700 text-white border-b border-blue-500 px-1 py-0.5 w-full max-w-xs focus:outline-none focus:border-white"
                        placeholder="Block Title"
                      />
                    </div>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="text-white hover:text-red-200 transition-colors duration-200"
                      title="Remove Block"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Block Description */}
                  <div className="px-4 pt-3 pb-1 bg-gray-50 border-b">
                    <input
                      type="text"
                      value={block.description}
                      onChange={(e) => updateBlockDetails(block.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-blue-500"
                      placeholder="Optional block description (e.g., 'Warm-up', 'Main strength', 'Cooldown')"
                    />
                  </div>
                  
                  {/* Block Content */}
                  <div className="p-4">
                    {/* Exercise Selection Tools */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Browse Library Button */}
                      <button
                        onClick={() => openExerciseLibrary(block.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        Browse Exercises
                      </button>
                      
                      {/* Random Exercise Button */}
                      <button
                        onClick={() => generateRandomExercise(block.id)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Random Exercise
                      </button>
                      
                      {/* Quick Add Dropdown for Muscle Groups */}
                      <div className="relative inline-block text-left">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              generateRandomExercise(block.id, 'muscleGroup', e.target.value);
                              e.target.value = ''; // Reset after use
                            }
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Add by Muscle Group...</option>
                          {muscleGroups.map(muscle => (
                            <option key={muscle} value={muscle}>{muscle}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Quick Add Dropdown for Categories */}
                      <div className="relative inline-block text-left">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              generateRandomExercise(block.id, 'category', e.target.value);
                              e.target.value = ''; // Reset after use
                            }
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Add by Category...</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Exercises Grid */}
                    {block.exercises.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-2">No exercises added to this block yet.</p>
                        <p className="text-sm text-gray-400">
                          Click "Browse Exercises" to add from the library, or use the quick add options.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {block.exercises.map((exercise, exIndex) => (
                          <div 
                            key={exercise.id} 
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 w-full"
                          >
                            {/* Exercise Image and Name */}
                            <div className="flex flex-col mb-3">
                              <div className="flex items-center mb-2">
                                <div 
                                  className="h-12 w-12 bg-gray-200 bg-cover bg-center rounded mr-3 flex-shrink-0"
                                  style={{ backgroundImage: `url(${exercise.imagePath})` }}
                                ></div>
                                <div>
                                  <h4 className="font-medium">{exIndex + 1}. {exercise.name}</h4>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{exercise.targetMuscleGroup}</span>
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">{exercise.category}</span>
                              </div>
                            </div>
                            
                            {/* Exercise Parameters */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {/* Sets */}
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Sets
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={exercise.sets}
                                  onChange={(e) => updateExercise(
                                    block.id,
                                    exercise.id,
                                    'sets',
                                    Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                                  )}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              
                              {/* Reps */}
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Reps
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={exercise.reps}
                                  onChange={(e) => updateExercise(
                                    block.id,
                                    exercise.id,
                                    'reps',
                                    Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
                                  )}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              
                              {/* Weight */}
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Weight (kg)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="2.5"
                                  value={exercise.weight}
                                  onChange={(e) => updateExercise(
                                    block.id,
                                    exercise.id,
                                    'weight',
                                    Math.max(0, parseFloat(e.target.value) || 0)
                                  )}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            
                            {/* Notes Field */}
                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Notes
                              </label>
                              <textarea
                                rows="2"
                                value={exercise.notes || ''}
                                onChange={(e) => updateExercise(
                                  block.id,
                                  exercise.id,
                                  'notes',
                                  e.target.value
                                )}
                                placeholder="Optional coaching notes..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                              ></textarea>
                            </div>
                            
                            {/* Exercise Controls */}
                            <div className="flex justify-between mt-2">
                              <div className="flex space-x-1">
                                {/* Move Up */}
                                <button
                                  onClick={() => moveExercise(block.id, exIndex, 'up')}
                                  disabled={exIndex === 0}
                                  className={`p-1 rounded-md ${
                                    exIndex === 0 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                  title="Move Up"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                
                                {/* Move Down */}
                                <button
                                  onClick={() => moveExercise(block.id, exIndex, 'down')}
                                  disabled={exIndex === block.exercises.length - 1}
                                  className={`p-1 rounded-md ${
                                    exIndex === block.exercises.length - 1
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                  title="Move Down"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Remove Exercise */}
                              <button
                                onClick={() => removeExercise(block.id, exercise.id)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                                title="Remove Exercise"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 font-medium rounded-md shadow-sm bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            
            <div className="flex space-x-3">
              {/* Mark as Performed Button - Only show in edit mode */}
              {isEditMode && (
                <button
                  onClick={openPerformModal}
                  className="px-6 py-3 font-medium rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {workoutPlan.actualPerformance ? 'Update Performance' : 'Mark as Performed'}
                </button>
              )}
              
              {/* Save Workout Button */}
              <button
                onClick={openSaveModal}
                disabled={workoutPlan.blocks.length === 0}
                className={`px-6 py-3 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  workoutPlan.blocks.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditMode ? 'Update Workout Plan' : 'Save Workout Plan'}
              </button>
            </div>
          </div>
          
{/* Exercise Library Modal */}
{showExerciseLibrary && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-lg shadow-xl max-w-6xl mx-auto w-full flex flex-col max-h-[90vh]">
      {/* Modal Header */}
      <div className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center rounded-t-lg flex-shrink-0">
        <h3 className="text-lg font-semibold">Select Exercise</h3>
        <button
          onClick={() => setShowExerciseLibrary(false)}
          className="text-white hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Filter Controls - SINGLE SET OF CONTROLS */}
      <div className="px-3 py-2 border-b flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="searchQuery" className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={exerciseFilters.searchQuery}
              onChange={handleFilterChange}
              placeholder="Search exercises..."
              className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Muscle Group Filter */}
          <div>
            <label htmlFor="muscleGroup" className="block text-xs font-medium text-gray-700 mb-1">
              Muscle Group
            </label>
            <select
              id="muscleGroup"
              name="muscleGroup"
              value={exerciseFilters.muscleGroup}
              onChange={handleFilterChange}
              className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={exerciseFilters.category}
              onChange={handleFilterChange}
              className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Clear Filters Button */}
          <div className="md:col-span-4 flex justify-end mt-1">
            <button
              onClick={clearFilters}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Exercise Grid */}
      <div className="p-3 overflow-y-auto flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredExercises.map(exercise => (
            <div 
              key={exercise.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col"
              onClick={() => addExerciseToBlock(currentBlockId, exercise)}
            >
              <div className="flex justify-center items-center h-24 bg-gray-50 overflow-hidden p-2">
                <img 
                  src={exercise.imagePath}
                  alt={exercise.name}
                  className="h-20 w-auto object-contain max-w-full"
                />
              </div>
              <div className="p-2 flex-grow">
                <h4 className="font-medium text-sm mb-1">{exercise.name}</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                    {exercise.targetMuscleGroup}
                  </span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded-full">
                    {exercise.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No exercises match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
          
          {/* Save Workout Modal */}
          {showSaveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div ref={saveModalRef} className="bg-white rounded-lg shadow-xl max-w-md mx-auto w-full p-6">
                <h3 className="text-xl font-semibold mb-4">Save Workout Plan</h3>
                
                <form onSubmit={handleSaveWorkout}>
                  <div className="mb-4">
                    <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      id="planName"
                      name="name"
                      value={workoutPlan.name}
                      onChange={handleWorkoutDetailsChange}
                      ref={saveNameInputRef}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`${selectedPlayer.name}'s Workout`}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      This workout contains {workoutPlan.blocks.length} blocks with a total of {getTotalExercises()} exercises.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {isEditMode ? 'Update Plan' : 'Save Plan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Performance Modal */}
          <WorkoutPerformModal
            isOpen={showPerformModal}
            onClose={() => setShowPerformModal(false)}
            workoutPlan={workoutPlan}
          />
        </>
      )}
    </div>
  );
};

export default WorkoutPlanner;