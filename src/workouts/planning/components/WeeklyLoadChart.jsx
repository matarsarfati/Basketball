// src/workouts/planning/components/WeeklyLoadChart.jsx
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useWeeklyPlanningContext } from '../../../context/WeeklyPlanningContext';

/**
 * WeeklyLoadChart Component
 * 
 * Displays a visual graph showing the total planned training load per week.
 * Helps coaches understand when training load increases or decreases across cycles.
 */
const WeeklyLoadChart = () => {
  const { weeklyPlans, calculateWeeklyLoad } = useWeeklyPlanningContext();
  
  // Calculate the training load for each week
  const chartData = useMemo(() => {
    return weeklyPlans
      .map(week => {
        // Calculate total load for the week using the context function
        const totalLoad = calculateWeeklyLoad(week.id);
        
        // Format the date for display
        const startDate = new Date(week.startDate);
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        return {
          weekId: week.id,
          weekTitle: week.title,
          date: formattedDate,
          totalLoad: totalLoad,
          // Define load level for conditional styling
          loadLevel: totalLoad > 2000 ? 'high' : totalLoad > 1000 ? 'medium' : 'low'
        };
      })
      // Sort by start date to ensure chronological display
      .sort((a, b) => {
        const weekA = weeklyPlans.find(w => w.id === a.weekId);
        const weekB = weeklyPlans.find(w => w.id === b.weekId);
        return new Date(weekA.startDate) - new Date(weekB.startDate);
      });
  }, [weeklyPlans, calculateWeeklyLoad]);
  
  // Custom tooltip to display detailed information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-sm">{data.weekTitle}</p>
          <p className="text-sm text-gray-600">Date: {data.date}</p>
          <p className="text-sm font-medium">
            Total Load: {data.totalLoad.toFixed(0)} units
          </p>
          <p className="text-xs italic mt-1">
            (Sum of intensity × duration for all sessions & drills)
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Define colors based on load level
  const getLineColor = (entry) => {
    if (entry.loadLevel === 'high') return "#ef4444";
    if (entry.loadLevel === 'medium') return "#3b82f6";
    return "#10b981";
  };
  
  // If no data is available yet
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Weekly Training Load</h3>
        <p className="text-gray-500">No training data available yet. Create and plan your weeks to see the load analysis.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Weekly Training Load Analysis</h3>
      <div className="text-sm text-gray-500 mb-4">
        This chart displays the total training load (intensity × duration) for each week, helping you monitor progressive overload and recovery periods.
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Training Load (intensity × duration)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#6b7280' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalLoad"
              name="Weekly Load"
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              stroke={(entry) => getLineColor(entry)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-red-500"></span>
          <span className="text-xs text-gray-600">High Load</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
          <span className="text-xs text-gray-600">Medium Load</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full mr-2 bg-green-500"></span>
          <span className="text-xs text-gray-600">Low Load</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLoadChart;