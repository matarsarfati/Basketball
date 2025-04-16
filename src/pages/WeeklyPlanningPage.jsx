import React from 'react';
import { WeeklyPlanner } from '../workouts/planning';

/**
 * WeeklyPlanningPage Component
 * 
 * This page displays the weekly training planner for managing weekly training schedules.
 * Features:
 * - Week selection
 * - Morning and evening session planning
 * - Visual calendar interface
 */
const WeeklyPlanningPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Training Planning</h1>
      
      <WeeklyPlanner />
    </div>
  );
};

export default WeeklyPlanningPage;