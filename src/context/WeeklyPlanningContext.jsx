// src/context/WeeklyPlanningContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const WeeklyPlanningContext = createContext();

// Empty session template
const createEmptySession = () => ({
  title: '',
  description: '',
  duration: 0,
  intensity: 0,
  status: 'planned',
  drills: [],
  numberOfFields: 1,
  sequences: ''
});

// Provider component
export const WeeklyPlanningProvider = ({ children }) => {
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [currentWeekId, setCurrentWeekId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadWeeklyPlans = () => {
      try {
        const savedPlans = localStorage.getItem('weeklyPlans');
        const savedCurrentWeekId = localStorage.getItem('currentWeekId');
        
        if (savedPlans) {
          setWeeklyPlans(JSON.parse(savedPlans));
        }
        
        if (savedCurrentWeekId) {
          setCurrentWeekId(savedCurrentWeekId);
        }
      } catch (error) {
        console.error('Error loading weekly plans:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeeklyPlans();
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('weeklyPlans', JSON.stringify(weeklyPlans));
      
      if (currentWeekId) {
        localStorage.setItem('currentWeekId', currentWeekId);
      }
    }
  }, [weeklyPlans, currentWeekId, loading]);
  
  // Create a new week plan
  const createWeekPlan = (startDate) => {
    // Ensure startDate is a Sunday
    const date = new Date(startDate);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // If not already a Sunday, adjust to the previous Sunday
    if (day !== 0) {
      date.setDate(date.getDate() - day);
    }
    
    // Create end date (Saturday)
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    
    // Create days array (Sunday to Saturday)
    const days = [];
    const currentDate = new Date(date);
    
    for (let i = 0; i < 7; i++) {
      days.push({
        date: new Date(currentDate).toISOString(),
        sessions: {
          morning: createEmptySession(),
          evening: createEmptySession()
        }
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create the week plan
    const weekPlan = {
      id: uuidv4(),
      title: `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      startDate: date.toISOString(),
      endDate: endDate.toISOString(),
      days
    };
    
    // Add to weekly plans
    setWeeklyPlans(prev => [...prev, weekPlan]);
    setCurrentWeekId(weekPlan.id);
    
    return weekPlan.id;
  };
  
  // Delete a week plan
  const deleteWeekPlan = (weekId) => {
    setWeeklyPlans(prev => prev.filter(week => week.id !== weekId));
    
    // If the deleted week was current, set to the most recent week
    if (weekId === currentWeekId) {
      const remainingWeeks = weeklyPlans.filter(week => week.id !== weekId);
      if (remainingWeeks.length > 0) {
        // Sort by start date and select the most recent
        const sortedWeeks = [...remainingWeeks].sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        setCurrentWeekId(sortedWeeks[0].id);
      } else {
        setCurrentWeekId(null);
      }
    }
  };
  
  // Duplicate a week plan
  const duplicateWeekPlan = (weekId) => {
    const weekToDuplicate = weeklyPlans.find(week => week.id === weekId);
    
    if (!weekToDuplicate) return;
    
    // Create a new date for the next week
    const startDate = new Date(weekToDuplicate.startDate);
    startDate.setDate(startDate.getDate() + 7);
    
    const endDate = new Date(weekToDuplicate.endDate);
    endDate.setDate(endDate.getDate() + 7);
    
    // Deep clone the days array
    const days = weekToDuplicate.days.map(day => {
      const dayDate = new Date(day.date);
      dayDate.setDate(dayDate.getDate() + 7);
      
      return {
        date: dayDate.toISOString(),
        sessions: {
          morning: { ...day.sessions.morning },
          evening: { ...day.sessions.evening }
        }
      };
    });
    
    // Create the new week plan
    const newWeekPlan = {
      id: uuidv4(),
      title: `Week of ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (Copy)`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days
    };
    
    // Add to weekly plans
    setWeeklyPlans(prev => [...prev, newWeekPlan]);
    setCurrentWeekId(newWeekPlan.id);
    
    return newWeekPlan.id;
  };
  
  // Update a session
  const updateSession = (weekId, dayIndex, sessionType, sessionData) => {
    setWeeklyPlans(prev => prev.map(week => {
      if (week.id !== weekId) return week;
      
      const updatedDays = [...week.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        sessions: {
          ...updatedDays[dayIndex].sessions,
          [sessionType]: sessionData
        }
      };
      
      return {
        ...week,
        days: updatedDays
      };
    }));
  };
  
  // Get the current week plan
  const getCurrentWeekPlan = () => {
    if (!currentWeekId) return null;
    return weeklyPlans.find(week => week.id === currentWeekId) || null;
  };
  
  // Calculate total planned load for a week
  const calculateWeeklyLoad = (weekId) => {
    const week = weeklyPlans.find(w => w.id === weekId);
    if (!week) return 0;
    
    let totalLoad = 0;
    
    week.days.forEach(day => {
      // Process morning sessions
      if (day.sessions.morning) {
        totalLoad += (day.sessions.morning.intensity || 0) * (day.sessions.morning.duration || 0);
        
        // Add drill-based load if there are drills
        if (day.sessions.morning.drills && day.sessions.morning.drills.length > 0) {
          day.sessions.morning.drills.forEach(drill => {
            if (drill.plannedIntensity) {
              totalLoad += drill.plannedIntensity * (drill.totalTime || 0);
            }
          });
        }
      }
      
      // Process evening sessions
      if (day.sessions.evening) {
        totalLoad += (day.sessions.evening.intensity || 0) * (day.sessions.evening.duration || 0);
        
        // Add drill-based load if there are drills
        if (day.sessions.evening.drills && day.sessions.evening.drills.length > 0) {
          day.sessions.evening.drills.forEach(drill => {
            if (drill.plannedIntensity) {
              totalLoad += drill.plannedIntensity * (drill.totalTime || 0);
            }
          });
        }
      }
    });
    
    return totalLoad;
  };
  
  // Context value
  const value = {
    weeklyPlans,
    currentWeekId,
    loading,
    setCurrentWeekId,
    createWeekPlan,
    deleteWeekPlan,
    duplicateWeekPlan,
    updateSession,
    getCurrentWeekPlan,
    calculateWeeklyLoad
  };
  
  return (
    <WeeklyPlanningContext.Provider value={value}>
      {children}
    </WeeklyPlanningContext.Provider>
  );
};

// Custom hook for using the context
export const useWeeklyPlanningContext = () => {
  const context = useContext(WeeklyPlanningContext);
  
  if (!context) {
    throw new Error('useWeeklyPlanningContext must be used within a WeeklyPlanningProvider');
  }
  
  return context;
};