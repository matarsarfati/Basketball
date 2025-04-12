import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { exportPerformanceData } from '../../shared/utils/exportUtils';

/**
 * ActualPerformanceComparison Component
 * 
 * Displays a comparison between planned and actual workout performance data:
 * - Bar/Line chart comparing planned vs actual load
 * - Exercise-specific performance details
 * - Volume and load metrics
 */
const ActualPerformanceComparison = ({ workout }) => {
  // State for chart type (bar or line)
  const [chartType, setChartType] = useState('bar');
  
  // If no actual performance data exists, show a message
  if (!workout.actualPerformance) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-500">No actual performance data recorded for this workout.</p>
      </div>
    );
  }
  
  // Prepare data for the charts
  const prepareChartData = () => {
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
        
        // Add to chart data
        exerciseData.push({
          name: exercise.name,
          planned: plannedVolume,
          actual: actualVolume,
          difference: actualVolume - plannedVolume,
          // Percentage difference (avoiding division by zero)
          percentDiff: plannedVolume > 0 
            ? Math.round(((actualVolume - plannedVolume) / plannedVolume) * 100) 
            : 0
        });
      });
    });
    
    return exerciseData;
  };
  
  // Calculate overall metrics
  const calculateMetrics = (data) => {
    const totalPlanned = data.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
    const difference = totalActual - totalPlanned;
    const percentDiff = totalPlanned > 0 
      ? Math.round((difference / totalPlanned) * 100)
      : 0;
    
    return {
      totalPlanned,
      totalActual,
      difference,
      percentDiff
    };
  };
  
  // Get chart data and metrics
  const chartData = prepareChartData();
  const metrics = calculateMetrics(chartData);
  
  // Determine color based on percentage difference
  const getDiffColor = (percent) => {
    if (percent >= 10) return 'text-green-600';
    if (percent >= 0) return 'text-blue-600';
    if (percent >= -10) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };
  
  return (
    <div className="space-y-6">
      {/* Performance Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Performance Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Planned Volume */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm text-blue-600 font-medium">Planned Volume</div>
            <div className="text-2xl font-bold mt-1">{formatNumber(metrics.totalPlanned)}</div>
            <div className="text-xs text-blue-500 mt-1">
              Total Volume Load (weight × sets × reps)
            </div>
          </div>
          
          {/* Actual Volume */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-sm text-green-600 font-medium">Actual Volume</div>
            <div className="text-2xl font-bold mt-1">{formatNumber(metrics.totalActual)}</div>
            <div className="text-xs text-green-500 mt-1">
              Total Volume Load (weight × sets × reps)
            </div>
          </div>
          
          {/* Volume Difference */}
          <div className={`rounded-lg p-4 border ${getDiffColor(metrics.percentDiff).replace('text', 'border').replace('-600', '-200')} ${getDiffColor(metrics.percentDiff).replace('text', 'bg').replace('-600', '-50')}`}>
            <div className={`text-sm font-medium ${getDiffColor(metrics.percentDiff)}`}>
              Volume Difference
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold mt-1">{metrics.difference > 0 ? '+' : ''}{formatNumber(metrics.difference)}</div>
              <div className={`ml-2 text-sm ${getDiffColor(metrics.percentDiff)}`}>
                ({metrics.percentDiff > 0 ? '+' : ''}{metrics.percentDiff}%)
              </div>
            </div>
            <div className="text-xs mt-1 text-gray-500">
              Difference between actual and planned
            </div>
          </div>
          
          {/* RPE */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-sm text-purple-600 font-medium">Session RPE</div>
            <div className="text-2xl font-bold mt-1">{workout.actualPerformance.rpe}</div>
            <div className="text-xs text-purple-500 mt-1">
              Rate of Perceived Exertion (1-10)
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Date Performed:</span> {new Date(workout.actualPerformance.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Duration:</span> {workout.actualPerformance.duration} minutes
            </p>
          </div>
          
          {workout.actualPerformance.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Session Notes:</span> {workout.actualPerformance.notes}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">
            Volume Load Comparison
          </h3>
          
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm font-medium ${
                chartType === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-l-md`}
            >
              Bar Chart
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm font-medium ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-r-md`}
            >
              Line Chart
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="planned" name="Planned Volume" fill="#3b82f6" />
                <Bar dataKey="actual" name="Actual Volume" fill="#10b981" />
              </BarChart>
            ) : (
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Line type="monotone" dataKey="planned" name="Planned Volume" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="actual" name="Actual Volume" stroke="#10b981" activeDot={{ r: 8 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Exercise Details Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Exercise Performance Details
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Difference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(item.planned)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(item.actual)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDiffColor(item.percentDiff)}`}>
                    {item.difference > 0 ? '+' : ''}{formatNumber(item.difference)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getDiffColor(item.percentDiff)}`}>
                    {item.percentDiff > 0 ? '+' : ''}{item.percentDiff}%
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Summary row */}
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  TOTALS
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatNumber(metrics.totalPlanned)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatNumber(metrics.totalActual)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getDiffColor(metrics.percentDiff)}`}>
                  {metrics.difference > 0 ? '+' : ''}{formatNumber(metrics.difference)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getDiffColor(metrics.percentDiff)}`}>
                  {metrics.percentDiff > 0 ? '+' : ''}{metrics.percentDiff}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Export Options */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Export Performance Data</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => exportPerformanceData(workout, `${workout.name.replace(/\s+/g, '-')}-performance`)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Export Data
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Print Report
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Export performance data for further analysis or reporting. The data will be exported in both CSV and JSON formats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActualPerformanceComparison;