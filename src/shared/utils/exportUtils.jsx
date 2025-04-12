/**
 * Export Utilities
 * 
 * Functions for exporting data to different formats (JSON, CSV, eventually PDF)
 */

/**
 * Export workout data to JSON file
 * @param {Object} data - The data to export
 * @param {string} filename - The name for the exported file
 */
export const exportToJSON = (data, filename = 'workout-data') => {
    try {
      // Convert data to JSON string
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create a blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      return false;
    }
  };
  
  /**
   * Export workout data to CSV file
   * @param {Array} data - Array of objects to export
   * @param {string} filename - The name for the exported file
   */
  export const exportToCSV = (data, filename = 'workout-data') => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data must be a non-empty array');
      }
      
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV header row
      let csvContent = headers.join(',') + '\n';
      
      // Add data rows
      data.forEach(item => {
        const row = headers.map(header => {
          // Handle special cases (objects, arrays, etc.)
          const value = item[header];
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } else {
            return `"${String(value).replace(/"/g, '""')}"`;
          }
        });
        
        csvContent += row.join(',') + '\n';
      });
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return false;
    }
  };
  
  /**
   * Export performance data in a format suitable for workout comparison
   * @param {Object} workout - The workout with performance data
   * @param {string} filename - The name for the exported file
   */
  export const exportPerformanceData = (workout, filename = 'performance-data') => {
    try {
      if (!workout || !workout.actualPerformance) {
        throw new Error('No performance data available');
      }
      
      // Prepare comparison data
      const exerciseData = [];
      
      // For each block in the workout plan
      workout.blocks.forEach(block => {
        // For each exercise in the block
        block.exercises.forEach(exercise => {
          // Calculate planned volume
          const plannedVolume = (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
          
          // Find the corresponding actual block and exercise
          const actualBlock = workout.actualPerformance.blocks.find(b => b.blockId === block.id);
          if (!actualBlock) return;
          
          const actualExercise = actualBlock.exercises.find(e => e.exerciseId === exercise.exerciseId);
          if (!actualExercise) return;
          
          // Calculate actual volume
          const actualVolume = (actualExercise.actualSets || 0) * 
                             (actualExercise.actualReps || 0) * 
                             (actualExercise.actualWeight || 0);
          
          // Add to data
          exerciseData.push({
            exercise: exercise.name,
            muscleGroup: exercise.targetMuscleGroup || 'Unknown',
            plannedSets: exercise.sets || 0,
            plannedReps: exercise.reps || 0,
            plannedWeight: exercise.weight || 0,
            plannedVolume: plannedVolume,
            actualSets: actualExercise.actualSets || 0,
            actualReps: actualExercise.actualReps || 0,
            actualWeight: actualExercise.actualWeight || 0,
            actualVolume: actualVolume,
            completionRate: plannedVolume > 0 
              ? Math.round((actualVolume / plannedVolume) * 100) 
              : 100,
            notes: actualExercise.notes || ''
          });
        });
      });
      
      // Create summary data
      const summary = {
        workoutName: workout.name,
        playerName: workout.playerName,
        date: workout.actualPerformance.date,
        rpe: workout.actualPerformance.rpe,
        duration: workout.actualPerformance.duration,
        notes: workout.actualPerformance.notes || '',
        totalPlannedVolume: exerciseData.reduce((sum, item) => sum + item.plannedVolume, 0),
        totalActualVolume: exerciseData.reduce((sum, item) => sum + item.actualVolume, 0)
      };
      
      // Export exercise details as CSV
      exportToCSV(exerciseData, `${filename}-exercises`);
      
      // Export summary as JSON
      exportToJSON({
        summary,
        exercises: exerciseData
      }, filename);
      
      return true;
    } catch (error) {
      console.error('Error exporting performance data:', error);
      return false;
    }
  };
  
  /**
   * Format workout load data for export
   * @param {Array} workouts - Array of workouts with performance data
   * @param {string} playerId - Player ID for the export
   * @param {string} playerName - Player name for the export
   * @param {string} filename - The name for the exported file
   */
  export const exportWorkoutLoadData = (workouts, playerId, playerName, filename = 'workout-load-data') => {
    try {
      if (!Array.isArray(workouts) || workouts.length === 0) {
        throw new Error('No workout data available');
      }
      
      // Filter workouts with actual performance data
      const performedWorkouts = workouts.filter(workout => workout.actualPerformance);
      
      if (performedWorkouts.length === 0) {
        throw new Error('No performed workouts available');
      }
      
      // Format data for export
      const loadData = performedWorkouts.map(workout => {
        // Calculate planned volume
        let plannedVolume = 0;
        workout.blocks.forEach(block => {
          block.exercises.forEach(exercise => {
            plannedVolume += (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
          });
        });
        
        // Calculate actual volume
        let actualVolume = 0;
        workout.actualPerformance.blocks.forEach(block => {
          block.exercises.forEach(exercise => {
            actualVolume += (exercise.actualSets || 0) * 
                           (exercise.actualReps || 0) * 
                           (exercise.actualWeight || 0);
          });
        });
        
        // Return formatted data
        return {
          workoutId: workout.id,
          workoutName: workout.name,
          date: workout.actualPerformance.date,
          rpe: workout.actualPerformance.rpe,
          duration: workout.actualPerformance.duration,
          plannedVolume: Math.round(plannedVolume),
          actualVolume: Math.round(actualVolume),
          completionRate: plannedVolume > 0 
            ? Math.round((actualVolume / plannedVolume) * 100) 
            : 100,
        };
      });
      
      // Sort by date
      loadData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Create metadata
      const metadata = {
        playerId,
        playerName,
        exportDate: new Date().toISOString(),
        workoutCount: loadData.length,
        dateRange: {
          start: loadData[0].date,
          end: loadData[loadData.length - 1].date
        }
      };
      
      // Export load data as CSV
      exportToCSV(loadData, `${filename}-load`);
      
      // Export complete data as JSON
      exportToJSON({
        metadata,
        loadData
      }, filename);
      
      return true;
    } catch (error) {
      console.error('Error exporting workout load data:', error);
      return false;
    }
  };
  
  /**
   * Future feature: Export to PDF
   * This will be implemented in the future
   */
  export const exportToPDF = (data, filename = 'workout-report') => {
    // This is a placeholder for future implementation
    console.log('PDF export will be available in a future update');
    alert('PDF export will be available in a future update. Please use the CSV or JSON export options for now.');
    return false;
  };