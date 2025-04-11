/**
 * Workouts Module
 * This module handles all workout-related functionality including:
 * - Exercise library management
 * - Workout planning
 * - Training automation
 * - Load management
 */

// Export exercise-related components
export { default as exerciseData, getAllMuscleGroups, getAllCategories, getAllEquipment } from './exercises/exerciseData';
export { default as ExerciseLibrary } from './exercises/ExerciseLibrary';

// Export workout planner components
export { default as WorkoutPlanner } from './planner/WorkoutPlanner';

// Future exports (to be implemented)
// export { default as WorkoutHistory } from './history/WorkoutHistory';
// export { default as WorkoutCalendar } from './calendar/WorkoutCalendar';
// export { default as LoadManagement } from './load/LoadManagement';