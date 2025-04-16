// src/workouts/planning/WeeklyPlannerRow.jsx
import React from 'react';
import SessionCell from '../planning/SessionCell';
import { useWeeklyPlanningContext } from '../../context/WeeklyPlanningContext';

/**
 * WeeklyPlannerRow Component
 * 
 * Displays a row of session cells for a specific time slot (morning/evening)
 */
const WeeklyPlannerRow = ({ week, sessionType, title }) => {
  const { currentWeekId, updateSession } = useWeeklyPlanningContext();
  
  // Handle session update
  const handleSessionUpdate = (dayIndex, sessionData) => {
    updateSession(currentWeekId, dayIndex, sessionType, sessionData);
  };
  
  return (
    <div className="grid grid-cols-8 min-h-[120px]">
      {/* Time slot label */}
      <div className="p-3 font-medium bg-gray-100 flex items-center justify-center border-r border-gray-200">
        {title}
      </div>
      
      {/* Session cells */}
      {week.days.map((day, index) => (
        <SessionCell 
          key={index}
          session={day.sessions[sessionType]}
          dayIndex={index}
          onUpdate={(data) => handleSessionUpdate(index, data)}
        />
      ))}
    </div>
  );
};

export default WeeklyPlannerRow;