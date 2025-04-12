import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Area
} from 'recharts';
import { useWorkoutContext } from '../../context/WorkoutContext';
import { exportWorkoutLoadData } from '../../shared/utils/exportUtils';

/**
 * WorkoutLoadComparison Component
 * 
 * Displays comparisons between planned and actual workout loads over time:
 * - Line graph showing planned vs actual loads
 * - ACWR (Acute:Chronic Workload Ratio) visualization
 * - Weekly load comparison
 * - Exercise-specific load tracking
 */
const WorkoutLoadComparison = ({ playerId }) => {
  // Access workout context
  const { 
    getPlayerWorkoutPlans, 
    calculateAcuteLoad,
    calculateChronicLoad,
    calculateACWR
  } = useWorkoutContext();
  
  // State for chart type
  const [chartType, setChartType] = useState('line');
  
  // State for time range
  const [timeRange, setTimeRange] = useState('3months'); // '1month', '3months', '6months', 'year'
  
  // State for metric type
  const [metricType, setMetricType] = useState('volume'); // 'volume', 'weekly', 'acwr'
  
  // Get workout plans for this player
  const playerWorkouts = getPlayerWorkoutPlans(playerId);
  
  // Calculate actual vs planned load data
  const calculateLoadData = () => {
    // Filter workouts with actual performance data
    const performedWorkouts = playerWorkouts.filter(workout => workout.actualPerformance);
    
    // Sort by date performed
    const sortedWorkouts = performedWorkouts.sort((a, b) => {
      return new Date(a.actualPerformance.date) - new Date(b.actualPerformance.date);
    });
    
    // Apply time range filter
    const filteredWorkouts = filterByTimeRange(sortedWorkouts);
    
    // Format data for chart
    return filteredWorkouts.map(workout => {
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
        name: new Date(workout.actualPerformance.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        date: new Date(workout.actualPerformance.date),
        workoutName: workout.name,
        planned: Math.round(plannedVolume),
        actual: Math.round(actualVolume),
        difference: Math.round(actualVolume - plannedVolume),
        percentDiff: plannedVolume > 0 
          ? Math.round(((actualVolume - plannedVolume) / plannedVolume) * 100) 
          : 0,
        rpe: workout.actualPerformance.rpe,
        duration: workout.actualPerformance.duration,
      };
    });
  };
  
  // Filter workouts by selected time range
  const filterByTimeRange = (workouts) => {
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case '1month':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'year':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
    }
    
    return workouts.filter(workout => {
      const performanceDate = new Date(workout.actualPerformance.date);
      return performanceDate >= cutoffDate;
    });
  };
  
  // Calculate weekly load data
  const calculateWeeklyLoadData = () => {
    const loadData = calculateLoadData();
    const weeklyData = [];
    
    // Group by week
    const weekMap = new Map();
    
    loadData.forEach(dayData => {
      const date = dayData.date;
      
      // Get week start date (Sunday)
      const day = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - day);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString();
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekStart,
          planned: 0,
          actual: 0,
          workouts: 0,
          totalRPE: 0,
        });
      }
      
      const weekData = weekMap.get(weekKey);
      weekData.planned += dayData.planned;
      weekData.actual += dayData.actual;
      weekData.workouts += 1;
      weekData.totalRPE += dayData.rpe;
    });
    
    // Convert map to array and calculate averages
    weekMap.forEach((data, key) => {
      weeklyData.push({
        name: `${data.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        weekStart: data.weekStart,
        planned: data.planned,
        actual: data.actual,
        workouts: data.workouts,
        avgRPE: data.workouts > 0 ? (data.totalRPE / data.workouts).toFixed(1) : 0,
      });
    });
    
    // Sort by date
    return weeklyData.sort((a, b) => a.weekStart - b.weekStart);
  };
  
  // Calculate ACWR data over time
  const calculateACWRData = () => {
    const weeklyData = calculateWeeklyLoadData();
    const acwrData = [];
    
    // Calculate acute and chronic loads for each week
    weeklyData.forEach((weekData, index) => {
      // Need at least 4 weeks of data for ACWR
      if (index < 3) return;
      
      // Calculate acute load (current week)
      const acuteLoad = weekData.actual;
      
      // Calculate chronic load (average of last 4 weeks including current)
      let chronicLoad = 0;
      for (let i = 0; i < 4; i++) {
        chronicLoad += weeklyData[index - i].actual;
      }
      chronicLoad = chronicLoad / 4;
      
      // Calculate ACWR
      const acwr = chronicLoad > 0 ? (acuteLoad / chronicLoad).toFixed(2) : 0;
      
      acwrData.push({
        name: weekData.name,
        weekStart: weekData.weekStart,
        acuteLoad,
        chronicLoad,
        acwr: parseFloat(acwr),
      });
    });
    
    return acwrData;
  };
  
  // Load data based on selected metric
  const getChartData = () => {
    switch (metricType) {
      case 'volume':
        return calculateLoadData();
      case 'weekly':
        return calculateWeeklyLoadData();
      case 'acwr':
        return calculateACWRData();
      default:
        return calculateLoadData();
    }
  };
  
  // Format chart labels based on metric type
  const getChartLabels = () => {
    switch (metricType) {
      case 'volume':
        return {
          yAxisLabel: 'Volume Load (kg)',
          tooltipLabel: 'Volume',
        };
      case 'weekly':
        return {
          yAxisLabel: 'Weekly Volume Load (kg)',
          tooltipLabel: 'Weekly Load',
        };
      case 'acwr':
        return {
          yAxisLabel: 'Load / Ratio',
          tooltipLabel: 'ACWR',
        };
      default:
        return {
          yAxisLabel: 'Volume Load (kg)',
          tooltipLabel: 'Volume',
        };
    }
  };
  
  // Get custom chart colors
  const getChartColors = () => {
    return {
      planned: '#3b82f6', // blue
      actual: '#10b981', // green
      acuteLoad: '#8b5cf6', // purple
      chronicLoad: '#6366f1', // indigo
      acwr: '#ef4444', // red
      threshold1: '#dc2626', // red-600 (upper threshold)
      threshold2: '#fbbf24', // amber-400 (middle threshold)
      threshold3: '#34d399', // emerald-400 (optimal zone)
    };
  };
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };
  
  // Get actual chart data to display
  const chartData = getChartData();
  const chartLabels = getChartLabels();
  const chartColors = getChartColors();
  
  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    const workoutsWithPerformance = playerWorkouts.filter(w => w.actualPerformance);
    
    // No data case
    if (workoutsWithPerformance.length === 0) {
      return {
        totalWorkouts: 0,
        avgCompletion: 0,
        avgRPE: 0,
        currentACWR: 0
      };
    }
    
    // Calculate total and completion
    let totalPlanned = 0;
    let totalActual = 0;
    let totalRPE = 0;
    
    workoutsWithPerformance.forEach(workout => {
      // Planned volume
      workout.blocks.forEach(block => {
        block.exercises.forEach(exercise => {
          totalPlanned += (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
        });
      });
      
      // Actual volume
      workout.actualPerformance.blocks.forEach(block => {
        block.exercises.forEach(exercise => {
          totalActual += (exercise.actualSets || 0) * 
                        (exercise.actualReps || 0) * 
                        (exercise.actualWeight || 0);
        });
      });
      
      totalRPE += workout.actualPerformance.rpe;
    });
    
    const avgCompletion = totalPlanned > 0 
      ? Math.round((totalActual / totalPlanned) * 100)
      : 0;
      
    const avgRPE = (totalRPE / workoutsWithPerformance.length).toFixed(1);
    
    // Get current ACWR
    const currentACWR = calculateACWR(playerId);
    
    return {
      totalWorkouts: workoutsWithPerformance.length,
      avgCompletion,
      avgRPE,
      currentACWR: currentACWR.toFixed(2)
    };
  };
  
  // Get ACWR status class
  const getACWRStatusClass = (acwr) => {
    if (acwr >= 1.5) return 'text-red-600';
    if (acwr >= 1.3) return 'text-yellow-600';
    if (acwr >= 0.8) return 'text-green-600';
    if (acwr > 0) return 'text-blue-600';
    return 'text-gray-500';
  };
  
  // Calculate summary metrics
  const summaryMetrics = calculateSummaryMetrics();
  
  // If no workouts with performance data, show a message
  if (playerWorkouts.filter(w => w.actualPerformance).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Workout Load Comparison
        </h3>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No workout performance data recorded yet.</p>
          <p className="text-sm text-gray-400">
            Log performance for workouts to see load comparisons and tracking.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Performance Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Workouts */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm text-blue-600 font-medium">Completed Workouts</div>
            <div className="text-2xl font-bold mt-1">{summaryMetrics.totalWorkouts}</div>
            <div className="text-xs text-blue-500 mt-1">
              Total logged workout sessions
            </div>
          </div>
          
          {/* Avg Completion */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-sm text-green-600 font-medium">Avg Completion Rate</div>
            <div className="text-2xl font-bold mt-1">{summaryMetrics.avgCompletion}%</div>
            <div className="text-xs text-green-500 mt-1">
              Average actual vs planned volume
            </div>
          </div>
          
          {/* Avg RPE */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-sm text-purple-600 font-medium">Average RPE</div>
            <div className="text-2xl font-bold mt-1">{summaryMetrics.avgRPE}</div>
            <div className="text-xs text-purple-500 mt-1">
              Average rate of perceived exertion
            </div>
          </div>
          
          {/* Current ACWR */}
          <div className={`rounded-lg p-4 border ${getACWRStatusClass(summaryMetrics.currentACWR).replace('text', 'border').replace('-600', '-200')} ${getACWRStatusClass(summaryMetrics.currentACWR).replace('text', 'bg').replace('-600', '-50')}`}>
            <div className={`text-sm font-medium ${getACWRStatusClass(summaryMetrics.currentACWR)}`}>
              Current ACWR
            </div>
            <div className="text-2xl font-bold mt-1">{summaryMetrics.currentACWR}</div>
            <div className="text-xs text-gray-500 mt-1">
              Acute:Chronic Workload Ratio
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 md:mb-0">
            Load Tracking
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Metric Type Selection */}
            <select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="volume">Daily Volume</option>
              <option value="weekly">Weekly Summary</option>
              <option value="acwr">ACWR Tracking</option>
            </select>
            
            {/* Time Range Selection */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">Last Year</option>
            </select>
            
            {/* Chart Type Toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm font-medium ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-l-md`}
              >
                Line
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm font-medium ${
                  chartType === 'bar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-r-md`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricType === 'acwr' ? (
              // ACWR Specialized Chart
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" 
                  label={{ value: 'Load (kg)', angle: -90, position: 'insideLeft' }} 
                />
                <YAxis yAxisId="right" orientation="right" domain={[0, 2]} 
                  label={{ value: 'ACWR', angle: 90, position: 'insideRight' }} 
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'acwr') return [value, 'ACWR'];
                    return [formatNumber(value), name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="acuteLoad" name="Acute Load (7 days)" fill={chartColors.acuteLoad} />
                <Bar yAxisId="left" dataKey="chronicLoad" name="Chronic Load (28 days)" fill={chartColors.chronicLoad} />
                <Line yAxisId="right" type="monotone" dataKey="acwr" name="ACWR" stroke={chartColors.acwr} strokeWidth={2} />
                
                {/* Reference Lines for ACWR Zones */}
                <Line yAxisId="right" dataKey={() => 1.5} stroke={chartColors.threshold1} strokeDasharray="5 5" dot={false} activeDot={false} />
                <Line yAxisId="right" dataKey={() => 1.3} stroke={chartColors.threshold2} strokeDasharray="5 5" dot={false} activeDot={false} />
                <Line yAxisId="right" dataKey={() => 0.8} stroke={chartColors.threshold3} strokeDasharray="5 5" dot={false} activeDot={false} />
              </ComposedChart>
            ) : chartType === 'line' ? (
              // Standard Line Chart
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: chartLabels.yAxisLabel, angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'planned') return [formatNumber(value), 'Planned Volume'];
                    if (name === 'actual') return [formatNumber(value), 'Actual Volume'];
                    if (name === 'workouts') return [value, 'Workout Count'];
                    if (name === 'avgRPE') return [value, 'Average RPE'];
                    return [formatNumber(value), name];
                  }}
                />
                <Legend />
                {metricType === 'volume' && (
                  <>
                    <Line type="monotone" dataKey="planned" name="Planned" stroke={chartColors.planned} strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke={chartColors.actual} strokeWidth={2} activeDot={{ r: 8 }} />
                  </>
                )}
                {metricType === 'weekly' && (
                  <>
                    <Line type="monotone" dataKey="planned" name="Planned" stroke={chartColors.planned} strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="actual" name="Actual" stroke={chartColors.actual} strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="workouts" name="Workouts" stroke="#f59e0b" strokeWidth={1} />
                    <Line type="monotone" dataKey="avgRPE" name="Avg RPE" stroke="#f43f5e" strokeWidth={1} />
                  </>
                )}
              </LineChart>
            ) : (
              // Bar Chart
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: chartLabels.yAxisLabel, angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'planned') return [formatNumber(value), 'Planned Volume'];
                    if (name === 'actual') return [formatNumber(value), 'Actual Volume'];
                    if (name === 'workouts') return [value, 'Workout Count'];
                    if (name === 'avgRPE') return [value, 'Average RPE'];
                    return [formatNumber(value), name];
                  }}
                />
                <Legend />
                {metricType === 'volume' && (
                  <>
                    <Bar dataKey="planned" name="Planned" fill={chartColors.planned} />
                    <Bar dataKey="actual" name="Actual" fill={chartColors.actual} />
                  </>
                )}
                {metricType === 'weekly' && (
                  <>
                    <Bar dataKey="planned" name="Planned" fill={chartColors.planned} />
                    <Bar dataKey="actual" name="Actual" fill={chartColors.actual} />
                  </>
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Legend for ACWR Zones (only shown for ACWR chart) */}
        {metricType === 'acwr' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center">
            <div style={{ backgroundColor: chartColors.threshold1 }} className="h-3 w-3 mr-1"></div>
              <span>Zone 1: ACWR &gt; 1.5 (High Risk)</span>
            </div>
            <div className="flex items-center">
              <div style={{ backgroundColor: chartColors.threshold2 }} className="h-3 w-3 mr-1"></div>
              <span>Zone 2: ACWR 1.3-1.5 (Caution)</span>
            </div>
            <div className="flex items-center">
              <div style={{ backgroundColor: chartColors.threshold3 }} className="h-3 w-3 mr-1"></div>
              <span>Zone 3: ACWR 0.8-1.3 (Optimal)</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 mr-1 border border-gray-300"></div>
              <span>Zone 4: ACWR &lt; 0.8 (Undertraining)</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Exercise-Specific Completion Rates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Exercise Completion Rates
        </h3>
        
        <ExerciseCompletionRates playerId={playerId} />
      </div>
      
      {/* Future Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Coming Soon
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-300 p-4 rounded-lg">
            <h4 className="font-medium text-lg mb-2 text-gray-700">Export Performance Data</h4>
            <p className="text-gray-600 text-sm mb-3">
              Export workout performance data and load comparisons for sharing with the team or for your records.
            </p>
            <button
              onClick={() => exportWorkoutLoadData(playerWorkouts, playerId, playerWorkouts[0]?.playerName || 'Player', `player-${playerId}-load-data`)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Export Load Data
            </button>
          </div>
          
          <div className="border border-dashed border-gray-300 p-4 rounded-lg">
            <h4 className="font-medium text-lg mb-2 text-gray-700">Advanced Analytics</h4>
            <p className="text-gray-600 text-sm">
              Predictive modeling for performance, injury risk assessment, and personalized load recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ExerciseCompletionRates Component (Sub-component)
const ExerciseCompletionRates = ({ playerId }) => {
  const { getPlayerWorkoutPlans } = useWorkoutContext();
  const playerWorkouts = getPlayerWorkoutPlans(playerId);
  
  // Get all performed workouts
  const performedWorkouts = playerWorkouts.filter(w => w.actualPerformance);
  
  // Calculate completion rates by exercise
  const calculateExerciseCompletionRates = () => {
    const exerciseData = {};
    
    // Process all performed workouts
    performedWorkouts.forEach(workout => {
      // Process each block
      workout.blocks.forEach(block => {
        // Process each exercise
        block.exercises.forEach(exercise => {
          // Calculate planned volume
          const plannedVolume = (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
          
          // Find the corresponding actual exercise
          const actualBlock = workout.actualPerformance.blocks.find(b => b.blockId === block.id);
          if (!actualBlock) return;
          
          const actualExercise = actualBlock.exercises.find(e => e.exerciseId === exercise.exerciseId);
          if (!actualExercise) return;
          
          // Calculate actual volume
          const actualVolume = (actualExercise.actualSets || 0) * 
                              (actualExercise.actualReps || 0) * 
                              (actualExercise.actualWeight || 0);
          
          // Add or update this exercise in our data
          if (!exerciseData[exercise.name]) {
            exerciseData[exercise.name] = {
              name: exercise.name,
              occurrences: 0,
              totalPlanned: 0,
              totalActual: 0
            };
          }
          
          exerciseData[exercise.name].occurrences += 1;
          exerciseData[exercise.name].totalPlanned += plannedVolume;
          exerciseData[exercise.name].totalActual += actualVolume;
        });
      });
    });
    
    // Convert to array and calculate completion rates
    return Object.values(exerciseData)
      .map(exercise => ({
        ...exercise,
        completionRate: exercise.totalPlanned > 0 
          ? Math.round((exercise.totalActual / exercise.totalPlanned) * 100) 
          : 100,
      }))
      .sort((a, b) => b.occurrences - a.occurrences);
  };
  
  const exerciseCompletionData = calculateExerciseCompletionRates();
  
  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };
  
  // Get color class based on completion rate
  const getCompletionRateColor = (rate) => {
    if (rate >= 100) return 'text-green-600';
    if (rate >= 85) return 'text-blue-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // If no data, show a message
  if (exerciseCompletionData.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No exercise performance data recorded yet.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exercise
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Occurrences
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Planned Volume
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actual Volume
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completion Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exerciseCompletionData.map((exercise, index) => (
            <tr key={exercise.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {exercise.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {exercise.occurrences}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatNumber(exercise.totalPlanned)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatNumber(exercise.totalActual)}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getCompletionRateColor(exercise.completionRate)}`}>
                {exercise.completionRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkoutLoadComparison;