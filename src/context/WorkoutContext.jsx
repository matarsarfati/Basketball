import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const WorkoutContext = createContext();

// Custom hook for using the workout context
export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};

// Provider component
export const WorkoutProvider = ({ children }) => {
  // State for the pending exercise to be added to a workout
  const [pendingExercise, setPendingExercise] = useState(null);
  
  // State for toast notification
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  // State for workout plans saved in localStorage
  const [workoutPlans, setWorkoutPlans] = useState([]);
  
  // State for the currently loaded plan (for editing)
  const [loadedPlan, setLoadedPlan] = useState(null);
  
  // Load workout plans from localStorage on mount
  useEffect(() => {
    const loadSavedPlans = () => {
      try {
        const savedPlans = localStorage.getItem('workoutPlans');
        if (savedPlans) {
          setWorkoutPlans(JSON.parse(savedPlans));
        }
      } catch (error) {
        console.error('Error loading workout plans:', error);
        showToast('Failed to load saved workout plans', 'error');
      }
    };
    
    loadSavedPlans();
  }, []);
  
  // Clear toast after timeout
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({
      visible: true,
      message,
      type
    });
  };
  
  // Add an exercise to be picked up by the WorkoutPlanner
  const addExerciseToPending = (exercise) => {
    setPendingExercise(exercise);
    showToast(`${exercise.name} added to workout!`);
  };
  
  // Clear the pending exercise (called after it's been added to a workout)
  const clearPendingExercise = () => {
    setPendingExercise(null);
  };
  
  // Save a workout plan to localStorage
  const saveWorkoutPlan = (plan) => {
    try {
      // Add timestamp and ensure plan has an ID
      const planToSave = {
        ...plan,
        id: plan.id || `plan-${Date.now()}`,
        createdAt: plan.createdAt || new Date().toISOString()
      };
      
      // Add to workout plans
      const updatedPlans = [...workoutPlans];
      
      // Check if plan already exists (update if it does)
      const existingPlanIndex = updatedPlans.findIndex(p => p.id === planToSave.id);
      if (existingPlanIndex >= 0) {
        // Update existing plan but preserve creation date
        const originalCreatedAt = updatedPlans[existingPlanIndex].createdAt;
        // Preserve actual performance data if it exists
        const actualPerformance = updatedPlans[existingPlanIndex].actualPerformance || null;
        
        updatedPlans[existingPlanIndex] = {
          ...planToSave,
          createdAt: originalCreatedAt,
          updatedAt: new Date().toISOString(),
          actualPerformance: actualPerformance
        };
      } else {
        // Add new plan
        updatedPlans.push(planToSave);
      }
      
      // Save to state and localStorage
      setWorkoutPlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      showToast(`Workout plan "${planToSave.name}" saved successfully!`);
      return true;
    } catch (error) {
      console.error('Error saving workout plan:', error);
      showToast('Failed to save workout plan', 'error');
      return false;
    }
  };
  
  // Save actual performance data for a workout
  const saveActualPerformance = (planId, actualData) => {
    try {
      const updatedPlans = [...workoutPlans];
      const planIndex = updatedPlans.findIndex(p => p.id === planId);
      
      if (planIndex < 0) {
        showToast('Workout plan not found', 'error');
        return false;
      }
      
      // Check if there's existing performance data and confirm overwrite
      const existingData = updatedPlans[planIndex].actualPerformance;
      
      // Add the actual performance data to the plan
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        actualPerformance: {
          ...actualData,
          recordedAt: new Date().toISOString()
        }
      };
      
      // Save to state and localStorage
      setWorkoutPlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      showToast(`Performance data recorded for "${updatedPlans[planIndex].name}"!`);
      return true;
    } catch (error) {
      console.error('Error saving performance data:', error);
      showToast('Failed to save performance data', 'error');
      return false;
    }
  };
  
  // Load a workout plan for editing
  const loadWorkoutPlan = (planId) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (plan) {
      setLoadedPlan(plan);
      showToast(`Loaded workout plan: ${plan.name}`);
      return plan;
    }
    return null;
  };
  
  // Clear the loaded plan
  const clearLoadedPlan = () => {
    setLoadedPlan(null);
  };
  
  // Delete a workout plan
  const deleteWorkoutPlan = (planId) => {
    try {
      const planToDelete = workoutPlans.find(p => p.id === planId);
      if (!planToDelete) return false;
      
      const updatedPlans = workoutPlans.filter(p => p.id !== planId);
      
      // Save to state and localStorage
      setWorkoutPlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      showToast(`Workout plan "${planToDelete.name}" deleted successfully!`);
      return true;
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      showToast('Failed to delete workout plan', 'error');
      return false;
    }
  };
  
  // Duplicate a workout plan
  const duplicateWorkoutPlan = (planId) => {
    try {
      const planToDuplicate = workoutPlans.find(p => p.id === planId);
      if (!planToDuplicate) return false;
      
      // Create a duplicate with new ID and timestamp
      const duplicatedPlan = {
        ...planToDuplicate,
        id: `plan-${Date.now()}`,
        name: `${planToDuplicate.name} (Copy)`,
        createdAt: new Date().toISOString(),
        // Don't copy actual performance data
        actualPerformance: null
      };
      
      // Add to workout plans
      const updatedPlans = [...workoutPlans, duplicatedPlan];
      
      // Save to state and localStorage
      setWorkoutPlans(updatedPlans);
      localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
      
      showToast(`Duplicated workout plan: ${duplicatedPlan.name}`);
      return duplicatedPlan.id;
    } catch (error) {
      console.error('Error duplicating workout plan:', error);
      showToast('Failed to duplicate workout plan', 'error');
      return false;
    }
  };
  
  // Get workout plans for a specific player
  const getPlayerWorkoutPlans = (playerId) => {
    return workoutPlans.filter(plan => plan.playerId === playerId);
  };
  
  // Calculate player's acute load (last 7 days)
  const calculateAcuteLoad = (playerId) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    const plans = getPlayerWorkoutPlans(playerId);
    const recentPlans = plans.filter(plan => {
      if (!plan.actualPerformance) return false;
      const performanceDate = new Date(plan.actualPerformance.date);
      return performanceDate >= sevenDaysAgo && performanceDate <= now;
    });
    
    // Calculate total load (RPE * Duration)
    const loads = recentPlans.map(plan => 
      (plan.actualPerformance.rpe || 0) * (plan.actualPerformance.duration || 0)
    );
    
    // Average load
    if (loads.length === 0) return 0;
    return loads.reduce((sum, load) => sum + load, 0) / 7; // Divide by 7 days, not number of workouts
  };
  
  // Calculate player's chronic load (last 28 days)
  const calculateChronicLoad = (playerId) => {
    const now = new Date();
    const twentyEightDaysAgo = new Date(now - 28 * 24 * 60 * 60 * 1000);
    
    const plans = getPlayerWorkoutPlans(playerId);
    const recentPlans = plans.filter(plan => {
      if (!plan.actualPerformance) return false;
      const performanceDate = new Date(plan.actualPerformance.date);
      return performanceDate >= twentyEightDaysAgo && performanceDate <= now;
    });
    
    // Calculate total load (RPE * Duration)
    const loads = recentPlans.map(plan => 
      (plan.actualPerformance.rpe || 0) * (plan.actualPerformance.duration || 0)
    );
    
    // Average load
    if (loads.length === 0) return 0;
    return loads.reduce((sum, load) => sum + load, 0) / 28; // Divide by 28 days, not number of workouts
  };
  
  // Calculate ACWR (Acute:Chronic Workload Ratio)
  const calculateACWR = (playerId) => {
    const acuteLoad = calculateAcuteLoad(playerId);
    const chronicLoad = calculateChronicLoad(playerId);
    
    if (chronicLoad === 0) return 0; // Avoid division by zero
    return acuteLoad / chronicLoad;
  };
  
  // Get weekly load data for a player (last 4-6 weeks)
  const getWeeklyLoadData = (playerId) => {
    const now = new Date();
    const sixWeeksAgo = new Date(now - 42 * 24 * 60 * 60 * 1000);
    
    const plans = getPlayerWorkoutPlans(playerId);
    const performedPlans = plans.filter(plan => plan.actualPerformance);
    
    // Group by week
    const weeklyData = [];
    
    // Create weeks (go back 6 weeks)
    for (let i = 0; i < 6; i++) {
      const weekEndDate = new Date(now - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEndDate - 7 * 24 * 60 * 60 * 1000);
      
      // Find workouts in this week
      const weekWorkouts = performedPlans.filter(plan => {
        const performanceDate = new Date(plan.actualPerformance.date);
        return performanceDate >= weekStartDate && performanceDate < weekEndDate;
      });
      
      // Calculate metrics
      const totalRPE = weekWorkouts.reduce((sum, plan) => sum + (plan.actualPerformance.rpe || 0), 0);
      const totalDuration = weekWorkouts.reduce((sum, plan) => sum + (plan.actualPerformance.duration || 0), 0);
      const totalLoad = weekWorkouts.reduce((sum, plan) => 
        sum + ((plan.actualPerformance.rpe || 0) * (plan.actualPerformance.duration || 0)), 0
      );
      
      // Calculate volume (weight * sets * reps) across all exercises
      let totalVolume = 0;
      weekWorkouts.forEach(plan => {
        if (plan.actualPerformance && plan.actualPerformance.blocks) {
          plan.actualPerformance.blocks.forEach(block => {
            if (block.exercises) {
              block.exercises.forEach(exercise => {
                totalVolume += (exercise.actualWeight || 0) * (exercise.actualSets || 0) * (exercise.actualReps || 0);
              });
            }
          });
        }
      });
      
      // Format date for display
      const weekLabel = `${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${
        weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }`;
      
      weeklyData.push({
        week: weekLabel,
        workouts: weekWorkouts.length,
        rpe: weekWorkouts.length ? (totalRPE / weekWorkouts.length).toFixed(1) : 0,
        duration: totalDuration,
        load: totalLoad,
        volume: totalVolume
      });
    }
    
    // Reverse to get chronological order
    return weeklyData.reverse();
  };
  
  // Context value to be provided
  const contextValue = {
    pendingExercise,
    addExerciseToPending,
    clearPendingExercise,
    toast,
    showToast,
    workoutPlans,
    saveWorkoutPlan,
    saveActualPerformance,
    loadWorkoutPlan,
    clearLoadedPlan,
    loadedPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    getPlayerWorkoutPlans,
    calculateAcuteLoad,
    calculateChronicLoad,
    calculateACWR,
    getWeeklyLoadData
  };
  
  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        } transition-opacity duration-300 opacity-90`}>
          {toast.message}
        </div>
      )}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;