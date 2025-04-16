// src/workouts/planning/WeeklyPlanner.jsx
import React, { useState } from 'react';
import { useWeeklyPlanningContext } from '../../context/WeeklyPlanningContext';
import WeeklyPlannerHeader from './WeeklyPlannerHeader';
import WeeklyPlannerRow from './WeeklyPlannerRow';
import WeekSelector from './WeekSelector';

/**
 * WeeklyPlanner Component
 * 
 * Main component for displaying and managing the weekly training plan
 * Features:
 * - Visual weekly planner with morning and evening sessions
 * - Week selection
 * - Table-like layout for session planning
 */
const WeeklyPlanner = () => {
  const { 
    getCurrentWeekPlan, 
    createWeekPlan,
    loading
  } = useWeeklyPlanningContext();
  
  // Get the current week's plan
  const currentWeek = getCurrentWeekPlan();
  
  // Handle creating a new week
  const handleCreateWeek = () => {
    const startDate = new Date();
    // Set to beginning of the week (Monday)
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
    
    createWeekPlan(startDate);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Training Plan</h1>
      
      {/* Week Selection */}
      <div className="mb-6">
        <WeekSelector />
      </div>
      
      {currentWeek ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Planner Header */}
          <WeeklyPlannerHeader week={currentWeek} />
          
          {/* Planner Rows */}
          <div className="divide-y divide-gray-200">
            {/* Morning Sessions */}
            <WeeklyPlannerRow 
              week={currentWeek} 
              sessionType="morning" 
              title="Morning Sessions" 
            />
            
            {/* Evening Sessions */}
            <WeeklyPlannerRow 
              week={currentWeek} 
              sessionType="evening" 
              title="Evening Sessions" 
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No weekly plan created yet.</p>
          <button
            onClick={handleCreateWeek}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Week Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;