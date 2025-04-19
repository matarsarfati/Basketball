// src/workouts/planning/WeeklyPlannerHeader.jsx
import React from 'react';

/**
 * WeeklyPlannerHeader Component
 * 
 * Displays the days of the week as column headers for the planner
 * Starting with Sunday as the first day of the week
 */
const WeeklyPlannerHeader = ({ week }) => {
  // Get day names for the current week
  const getDayNames = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return week.days.map((day, index) => {
      const date = new Date(day.date);
      return {
        name: dayNames[index],
        date: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' })
      };
    });
  };
  
  const days = getDayNames();
  
  return (
    <div className="grid grid-cols-8 bg-blue-700 text-white">
      {/* Time slot column */}
      <div className="p-3 font-semibold border-r border-blue-600">
        Time Slot
      </div>
      
      {/* Day columns */}
      {days.map((day, index) => (
        <div key={index} className="p-3 text-center border-r border-blue-600 last:border-r-0">
          <div className="font-semibold">{day.name}</div>
          <div className="text-sm">{day.date} {day.month}</div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyPlannerHeader;