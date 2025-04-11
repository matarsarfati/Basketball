import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar, 
  ReferenceLine 
} from 'recharts';
import { useWorkoutContext } from '../context/WorkoutContext';

/**
 * PlayerLoad Component
 * 
 * Displays player load metrics and ACWR (Acute:Chronic Workload Ratio):
 * - Weekly load graph based on RPE x Duration or Volume
 * - ACWR calculation and visualization
 * - Load management recommendations
 */
const PlayerLoad = ({ playerId }) => {
  const { 
    getWeeklyLoadData, 
    calculateAcuteLoad, 
    calculateChronicLoad, 
    calculateACWR 
  } = useWorkoutContext();
  
  // Load data
  const weeklyData = getWeeklyLoadData(playerId);
  const acuteLoad = calculateAcuteLoad(playerId);
  const chronicLoad = calculateChronicLoad(playerId);
  const acwr = calculateACWR(playerId);
  
  // State for graph type
  const [graphType, setGraphType] = useState('load'); // 'load' or 'volume'
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  
  // Get ACWR status
  const getAcwrStatus = () => {
    if (acwr >= 1.5) return { status: 'High Risk', color: 'text-red-600', message: 'Significantly increased injury risk due to overloading.' };
    if (acwr >= 1.3) return { status: 'Moderate Risk', color: 'text-orange-500', message: 'Potential overload, consider reducing intensity/volume.' };
    if (acwr >= 0.8) return { status: 'Optimal', color: 'text-green-600', message: 'Good balance between training stress and recovery.' };
    if (acwr > 0) return { status: 'Undertraining', color: 'text-blue-600', message: 'Training stimulus may be insufficient for adaptation.' };
    return { status: 'No Data', color: 'text-gray-500', message: 'Not enough workout data recorded.' };
  };
  
  const acwrStatus = getAcwrStatus();
  
  // Format load for display
  const formatLoad = (load) => {
    return Math.round(load);
  };
  
  // Format ACWR for display (with color indicator)
  const formatAcwr = (acwr) => {
    if (acwr === 0) return 'N/A';
    return acwr.toFixed(2);
  };
  
  // Get color class for ACWR
  const getAcwrColorClass = () => {
    if (acwr >= 1.5) return 'bg-red-100 text-red-800';
    if (acwr >= 1.3) return 'bg-orange-100 text-orange-800';
    if (acwr >= 0.8) return 'bg-green-100 text-green-800';
    if (acwr > 0) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-6">
      {/* Load Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Load Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Acute Load Card */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm text-blue-600 font-medium">Acute Load (7 days)</div>
            <div className="text-3xl font-bold mt-1">{formatLoad(acuteLoad)}</div>
            <div className="text-xs text-blue-500 mt-1">
              Based on recent workout intensity & duration
            </div>
          </div>
          
          {/* Chronic Load Card */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="text-sm text-indigo-600 font-medium">Chronic Load (28 days)</div>
            <div className="text-3xl font-bold mt-1">{formatLoad(chronicLoad)}</div>
            <div className="text-xs text-indigo-500 mt-1">
              Based on established training baseline
            </div>
          </div>
          
          {/* ACWR Card */}
          <div className={`rounded-lg p-4 border ${
            acwrStatus.color.replace('text-', 'border-').replace('-600', '-200').replace('-500', '-200')
          } ${acwrStatus.color.replace('text-', 'bg-').replace('-600', '-50').replace('-500', '-50')}`}>
            <div className={`text-sm font-medium ${acwrStatus.color}`}>
              Acute:Chronic Workload Ratio
            </div>
            <div className="flex items-end">
              <div className="text-3xl font-bold mt-1">{formatAcwr(acwr)}</div>
              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getAcwrColorClass()}`}>
                {acwrStatus.status}
              </div>
            </div>
            <div className={`text-xs mt-1 ${acwrStatus.color.replace('-600', '-500').replace('-500', '-400')}`}>
              {acwrStatus.message}
            </div>
          </div>
        </div>
      </div>
      
      {/* Load Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">
            Training Load Visualization
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Graph Type Toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setGraphType('load')}
                className={`px-3 py-1 text-sm font-medium ${
                  graphType === 'load'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-l-md`}
              >
                RPE × Duration
              </button>
              <button
                type="button"
                onClick={() => setGraphType('volume')}
                className={`px-3 py-1 text-sm font-medium ${
                  graphType === 'volume'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-r-md`}
              >
                Volume Load
              </button>
            </div>
            
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
            {chartType === 'line' ? (
              <LineChart
                data={weeklyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                {graphType === 'load' ? (
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    name="Training Load (RPE×Duration)" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                  />
                ) : (
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    name="Volume Load (Weight×Sets×Reps)" 
                    stroke="#8b5cf6" 
                    activeDot={{ r: 8 }} 
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  name="Number of Workouts" 
                  stroke="#10b981" 
                />
              </LineChart>
            ) : (
              <BarChart
                data={weeklyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                {graphType === 'load' ? (
                  <Bar 
                    dataKey="load" 
                    name="Training Load (RPE×Duration)" 
                    fill="#3b82f6" 
                  />
                ) : (
                  <Bar 
                    dataKey="volume" 
                    name="Volume Load (Weight×Sets×Reps)" 
                    fill="#8b5cf6" 
                  />
                )}
                {/* Reference line for optimal load range (placeholder values) */}
                <ReferenceLine y={acuteLoad * 1.3} stroke="orange" strokeDasharray="3 3" label="Risk Threshold" />
                <ReferenceLine y={acuteLoad * 0.8} stroke="blue" strokeDasharray="3 3" label="Min Effective" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Load Management Guidelines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Load Management Guidelines
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 mt-1 mr-3"></div>
            <div>
              <h4 className="font-medium">ACWR &gt; 1.5: High Risk Zone</h4>
              <p className="text-gray-600 text-sm">
                Significant increase in injury risk. Consider reducing training load immediately.
                Implement recovery sessions and monitor for signs of overtraining.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-500 mt-1 mr-3"></div>
            <div>
              <h4 className="font-medium">ACWR 1.3-1.5: Caution Zone</h4>
              <p className="text-gray-600 text-sm">
                Elevated injury risk. Monitor athlete closely and consider reducing intensity
                while maintaining frequency. Focus on recovery quality.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1 mr-3"></div>
            <div>
              <h4 className="font-medium">ACWR 0.8-1.3: Optimal Zone</h4>
              <p className="text-gray-600 text-sm">
                Balanced training load with good adaptation stimulus and manageable fatigue.
                Continue with planned progression while monitoring performance.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 mt-1 mr-3"></div>
            <div>
              <h4 className="font-medium">ACWR &lt; 0.8: Undertraining Zone</h4>
              <p className="text-gray-600 text-sm">
                Insufficient training stimulus for optimal adaptation. Consider progressively
                increasing training load to maintain fitness and performance capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerLoad;