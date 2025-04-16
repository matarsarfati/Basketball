import React from 'react';
import { WeeklyPlanner } from '../workouts';
import WeeklyLoadChart from '../workouts/planning/components/WeeklyLoadChart';

/**
 * WeeklyPlanningPage Component
 * 
 * This page displays the weekly training planner for managing weekly training schedules.
 * Features:
 * - Week selection
 * - Morning and evening session planning
 * - Visual calendar interface
 * - Weekly load visualization
 */
const WeeklyPlanningPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Training Planning</h1>
      
      {/* Weekly Load Visualization Chart */}
      <WeeklyLoadChart />
      
      {/* Weekly Planner Component */}
      <WeeklyPlanner />
    </div>
  );
};

export default WeeklyPlanningPage;