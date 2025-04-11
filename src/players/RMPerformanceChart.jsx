import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Bar, BarChart
} from 'recharts';

/**
 * RMPerformanceChart Component
 * 
 * Displays visualization of a player's RM (Repetition Maximum) performance data over time.
 * Features:
 * - Line or bar chart visualization options
 * - Toggle between different strength metrics (bench press, squat, deadlift)
 * - Show/hide specific metrics
 * - Focus on one metric at a time or view all
 * - Responsive design for various screen sizes
 * - Export options (placeholders for future implementation)
 */
const RMPerformanceChart = ({ 
  rmDataHistory = [], 
  playerName = 'Player',
  chartType = 'line' // 'line' or 'bar'
}) => {
  // Available metrics to track
  const availableMetrics = [
    { id: 'benchPress', name: 'Bench Press', color: '#8884d8', active: true },
    { id: 'squat', name: 'Squat', color: '#82ca9d', active: true },
    { id: 'deadlift', name: 'Deadlift', color: '#ffc658', active: true },
    // Placeholders for future tests
    { id: 'pullDown', name: 'Pull Down', color: '#ff8042', active: false },
    { id: 'beepTest', name: 'Beep Test', color: '#0088fe', active: false }
  ];
  
  // State for active metrics
  const [metrics, setMetrics] = useState(availableMetrics);
  
  // State for focused metric (null means show all active metrics)
  const [focusedMetric, setFocusedMetric] = useState(null);
  
  // Format data for chart
  const formatChartData = () => {
    if (!rmDataHistory || rmDataHistory.length === 0) return [];
    
    return rmDataHistory.map(record => ({
      date: new Date(record.date).toLocaleDateString(),
      ...record.data
    }));
  };
  
  // Toggle a metric's active status
  const toggleMetric = (metricId) => {
    const updatedMetrics = metrics.map(metric => 
      metric.id === metricId 
        ? { ...metric, active: !metric.active }
        : metric
    );
    setMetrics(updatedMetrics);
    
    // If we're toggling off the currently focused metric, reset focus
    if (focusedMetric === metricId && !updatedMetrics.find(m => m.id === metricId).active) {
      setFocusedMetric(null);
    }
  };
  
  // Focus on a specific metric
  const focusMetric = (metricId) => {
    // If clicking the already focused metric, unfocus it
    if (focusedMetric === metricId) {
      setFocusedMetric(null);
      return;
    }
    
    // If the metric is inactive, activate it first
    if (!metrics.find(m => m.id === metricId).active) {
      toggleMetric(metricId);
    }
    
    setFocusedMetric(metricId);
  };
  
  // Generate chart components based on active metrics
  const getChartComponents = () => {
    // Filter to only active metrics, and further filter if there's a focused metric
    return metrics
      .filter(metric => metric.active)
      .filter(metric => focusedMetric ? metric.id === focusedMetric : true)
      .map(metric => {
        if (chartType === 'line') {
          return (
            <Line
              key={metric.id}
              type="monotone"
              dataKey={metric.id}
              name={metric.name}
              stroke={metric.color}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          );
        } else {
          return (
            <Bar
              key={metric.id}
              dataKey={metric.id}
              name={metric.name}
              fill={metric.color}
            />
          );
        }
      });
  };
  
  // The formatted data for the chart
  const chartData = formatChartData();
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No RM performance data available for {playerName}</p>
      </div>
    );
  }
  
  // Get the y-axis domain based on the data and active metrics
  const getYAxisDomain = () => {
    let maxValue = 0;
    
    const activeMetricIds = metrics
      .filter(m => m.active)
      .filter(m => focusedMetric ? m.id === focusedMetric : true)
      .map(m => m.id);
    
    chartData.forEach(entry => {
      activeMetricIds.forEach(metricId => {
        if (entry[metricId] && entry[metricId] > maxValue) {
          maxValue = entry[metricId];
        }
      });
    });
    
    // Add 10% buffer at the top
    return [0, Math.ceil(maxValue * 1.1)];
  };
  
  // Toggle chart type between line and bar
  const [currentChartType, setCurrentChartType] = useState(chartType);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 md:mb-0">
          RM Performance History
        </h3>
        
        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setCurrentChartType('line')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                currentChartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setCurrentChartType('bar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                currentChartType === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bar
            </button>
          </div>
          
          {/* Export Button (Placeholder) */}
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => alert('Export functionality will be implemented in future stages')}
          >
            Export PDF
          </button>
        </div>
      </div>
      
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(metric => (
          <div key={metric.id} className="flex items-center">
            <button
              className={`mr-2 px-3 py-1 text-xs font-medium rounded-full ${
                metric.active
                  ? `bg-${metric.color.replace('#', '')} text-white`
                  : 'bg-gray-200 text-gray-700'
              } ${focusedMetric === metric.id ? 'ring-2 ring-blue-400' : ''}`}
              style={{ backgroundColor: metric.active ? metric.color : undefined }}
              onClick={() => toggleMetric(metric.id)}
            >
              {metric.active ? '✓' : '○'} {metric.name}
            </button>
            
            <button
              className="text-xs text-gray-500 hover:text-blue-600"
              onClick={() => focusMetric(metric.id)}
            >
              {focusedMetric === metric.id ? 'Unfocus' : 'Focus'}
            </button>
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {currentChartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                domain={getYAxisDomain()} 
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip />
              <Legend />
              {getChartComponents()}
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                domain={getYAxisDomain()} 
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip />
              <Legend />
              {getChartComponents()}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Future Feature Placeholder */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Coming Soon</h4>
        <p className="text-xs text-gray-600">
          Future features will include automatic training intensity calculations based on RM values,
          trend analysis, and additional performance metrics like Beep Test and Pull Down.
        </p>
      </div>
    </div>
  );
};

export default RMPerformanceChart;