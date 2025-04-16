/**
 * Workouts Module
 * This module handles all workout-related functionality including:
 * - Exercise library management
 * - Workout planning
 * - Training automation
 * - Load management
 * - Performance tracking and analysis
 * - Weekly training planning
 */

// Export exercise-related components
export { default as exerciseData, getAllMuscleGroups, getAllCategories, getAllEquipment } from './exercises/exerciseData';
export { default as ExerciseLibrary } from './exercises/ExerciseLibrary';

// Export workout planner components
export { default as WorkoutPlanner } from './planner/WorkoutPlanner';

// Export workout history and performance components
export { default as WorkoutHistory } from './history/WorkoutHistory';
export { default as WorkoutPerformModal } from './planner/WorkoutPerformModal';
export { default as ActualPerformanceComparison } from './history/ActualPerformanceComparison';
export { default as WorkoutLoadComparison } from './history/WorkoutLoadComparison';

// Export weekly planning components
export { default as WeeklyPlanner } from './planning/WeeklyPlanner';
export { default as WeeklyPlannerHeader } from './planning/WeeklyPlannerHeader';
export { default as WeeklyPlannerRow } from './planning/WeeklyPlannerRow';
export { default as SessionCell } from './planning/SessionCell';
export { default as WeekSelector } from './planning/WeekSelector';
export { default as WeeklyLoadChart } from './planning/components/WeeklyLoadChart';

// Future exports (to be implemented)
// export { default as WorkoutCalendar } from './calendar/WorkoutCalendar';