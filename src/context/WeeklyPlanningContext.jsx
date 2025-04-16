// src/context/WeeklyPlanningContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const WeeklyPlanningContext = createContext();

// Custom hook for using the context
export const useWeeklyPlanningContext = () => {
  const context = useContext(WeeklyPlanningContext);
  if (!context) {
    throw new Error('useWeeklyPlanningContext must be used within a WeeklyPlanningProvider');
  }
  return context;
};

// Provider component
export const WeeklyPlanningProvider = ({ children }) => {
  // State for weekly planning data
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  // State for the current active week
  const [currentWeekId, setCurrentWeekId] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for errors
  const [error, setError] = useState(null);

  // Load plans from localStorage on component mount
  useEffect(() => {
    const loadPlans = () => {
      try {
        setLoading(true);
        const savedPlans = localStorage.getItem('basketballTeamWeeklyPlans');
        if (savedPlans) {
          const parsedPlans = JSON.parse(savedPlans);
          setWeeklyPlans(parsedPlans);
          
          // Set most recent week as current if none is selected
          if (!currentWeekId && parsedPlans.length > 0) {
            setCurrentWeekId(parsedPlans[parsedPlans.length - 1].id);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load weekly plans from storage');
        setLoading(false);
        console.error('Error loading weekly plans:', err);
      }
    };

    loadPlans();
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    if (weeklyPlans.length > 0) {
      localStorage.setItem('basketballTeamWeeklyPlans', JSON.stringify(weeklyPlans));
    }
  }, [weeklyPlans]);

  // Get the current week plan
  const getCurrentWeekPlan = () => {
    return weeklyPlans.find(plan => plan.id === currentWeekId) || null;
  };

  // Create a new week plan
  const createWeekPlan = (startDate) => {
    const weekStartDate = new Date(startDate);
    
    // Generate empty week structure with morning and evening sessions for each day
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStartDate);
      currentDate.setDate(weekStartDate.getDate() + i);
      
      weekDays.push({
        date: currentDate.toISOString(),
        dayOfWeek: i,
        sessions: {
          morning: {
            id: `morning-${currentDate.toISOString()}`,
            title: '',
            description: '',
            drills: [],
            duration: 0,
            intensity: 0,
            status: 'planned', // planned, completed, canceled
          },
          evening: {
            id: `evening-${currentDate.toISOString()}`,
            title: '',
            description: '',
            drills: [],
            duration: 0,
            intensity: 0, 
            status: 'planned',
          }
        }
      });
    }

    const newWeek = {
      id: `week-${Date.now()}`,
      startDate: weekStartDate.toISOString(),
      endDate: new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      title: `Week of ${weekStartDate.toLocaleDateString()}`,
      days: weekDays,
      totalPlannedLoad: 0,
      totalActualLoad: 0,
    };

    setWeeklyPlans(prev => [...prev, newWeek]);
    setCurrentWeekId(newWeek.id);
    return newWeek;
  };

  // Update a session within a week
  const updateSession = (weekId, dayIndex, sessionType, sessionData) => {
    setWeeklyPlans(prev => 
      prev.map(week => {
        if (week.id === weekId) {
          const updatedDays = [...week.days];
          updatedDays[dayIndex] = {
            ...updatedDays[dayIndex],
            sessions: {
              ...updatedDays[dayIndex].sessions,
              [sessionType]: {
                ...updatedDays[dayIndex].sessions[sessionType],
                ...sessionData
              }
            }
          };
          
          return {
            ...week,
            days: updatedDays
          };
        }
        return week;
      })
    );
  };

  // Delete a week plan
  const deleteWeekPlan = (weekId) => {
    setWeeklyPlans(prev => prev.filter(week => week.id !== weekId));
    
    // If we deleted the current week, set a new current week
    if (currentWeekId === weekId) {
      const remainingPlans = weeklyPlans.filter(week => week.id !== weekId);
      if (remainingPlans.length > 0) {
        setCurrentWeekId(remainingPlans[remainingPlans.length - 1].id);
      } else {
        setCurrentWeekId(null);
      }
    }
  };

  // Duplicate a week plan
  const duplicateWeekPlan = (weekId, newStartDate) => {
    const weekToDuplicate = weeklyPlans.find(week => week.id === weekId);
    if (!weekToDuplicate) return null;
    
    const newWeekStartDate = newStartDate || new Date();
    
    // Create a deep copy with new IDs and dates
    const newWeek = {
      ...JSON.parse(JSON.stringify(weekToDuplicate)),
      id: `week-${Date.now()}`,
      startDate: newWeekStartDate.toISOString(),
      endDate: new Date(newWeekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      title: `Week of ${newWeekStartDate.toLocaleDateString()} (Copy)`,
    };
    
    // Update the dates for each day
    newWeek.days = newWeek.days.map((day, index) => {
      const dayDate = new Date(newWeekStartDate);
      dayDate.setDate(newWeekStartDate.getDate() + index);
      
      return {
        ...day,
        date: dayDate.toISOString(),
        sessions: {
          morning: {
            ...day.sessions.morning,
            id: `morning-${dayDate.toISOString()}`
          },
          evening: {
            ...day.sessions.evening,
            id: `evening-${dayDate.toISOString()}`
          }
        }
      };
    });
    
    setWeeklyPlans(prev => [...prev, newWeek]);
    return newWeek;
  };

  // Context value
  const value = {
    weeklyPlans,
    currentWeekId,
    setCurrentWeekId,
    getCurrentWeekPlan,
    createWeekPlan,
    updateSession,
    deleteWeekPlan,
    duplicateWeekPlan,
    loading,
    error,
  };

  return (
    <WeeklyPlanningContext.Provider value={value}>
      {children}
    </WeeklyPlanningContext.Provider>
  );
};

export default WeeklyPlanningContext;