import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import mockRMHistory from './mockRMHistory';

/**
 * PlayerProfileCompactRM Component
 * 
 * A compact version of the RM performance chart specifically for the player profile.
 * This shows a simplified view of the player's RM progression over time.
 */
const PlayerProfileCompactRM = ({ playerId }) => {
  // Get RM history data for this player
  const rmHistory = mockRMHistory[playerId] || [];
  
  // Format data for chart display
  const chartData = rmHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    ...record.data
  }));
  
  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-500 text-sm">No RM performance data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-2 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        RM Progression
      </h4>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="benchPress" 
              name="Bench Press"
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="squat" 
              name="Squat"
              stroke="#82ca9d" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="deadlift" 
              name="Deadlift"
              stroke="#ffc658" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-right">
        <a 
          href="#" 
          className="text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.preventDefault();
            alert('In a real app, this would link to the full RM Performance view');
          }}
        >
          View Detailed Report →
        </a>
      </div>
    </div>
  );
};

export default PlayerProfileCompactRM;