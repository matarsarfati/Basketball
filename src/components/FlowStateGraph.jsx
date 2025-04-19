// src/components/FlowStateGraph.jsx
import React from 'react';

const FlowStateGraph = () => {
  // Game data points
  const timePoints = ['Pre-Game', 'Start Q1', 'End Q1', 'Halftime', 'End Q3', 'End Game'];
  
  // Player metrics data
  const playerData = {
    cortisol: [18, 20, 21, 20, 19, 18],
    amylase: [90, 95, 100, 104, 108, 102],
    izof: [19, 20, 21, 22, 22, 21],
    prIndex: [null, 6.8, 7.9, 9.2, 10.6, 10.1]
  };

  // We'll use categorical Y-axis values
  const yAxisCategories = [
    { label: 'Within optimal zone', value: 'High' },
    { label: 'Near optimal', value: 'Medium' },
    { label: 'Outside optimal zone', value: 'Low' }
  ];

  // Optimal ranges for display
  const optimalRanges = {
    cortisol: '15-22 nmol/L',
    amylase: '75-110 U/mL',
    izof: '18-22 points'
  };

  // Calculate positions for graph plotting (simplified)
  const getYPosition = (metric, index) => {
    if (metric === 'prIndex' && index === 0) return null; // No PR Index for Pre-Game
    
    // Simplified positioning logic - in a real app you'd have proper normalization
    // This is just to mimic the visualization in your images
    if (metric === 'cortisol') {
      return playerData.cortisol[index] >= 15 && playerData.cortisol[index] <= 22 ? 'High' : 'Medium';
    } else if (metric === 'amylase') {
      return playerData.amylase[index] >= 75 && playerData.amylase[index] <= 110 ? 'High' : 'Medium';
    } else if (metric === 'izof') {
      return playerData.izof[index] >= 18 && playerData.izof[index] <= 22 ? 'High' : 'Medium';
    } else if (metric === 'prIndex') {
      if (index === 1) return 'Medium'; // Start Q1
      if (index === 2) return 'Medium'; // End Q1
      if (index === 3) return 'Medium'; // Halftime
      if (index === 4) return 'High';   // End Q3 (Flow Zone!)
      if (index === 5) return 'High';   // End Game
      return null;
    }
    return 'Medium';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Game Timeline Performance</h2>
      
      <div className="flex mb-8">
        {/* Player info and optimal ranges */}
        <div className="w-1/3 border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 border-b">
            <h3 className="text-lg font-semibold">Jason Crawford - Point Guard</h3>
          </div>
          <div className="p-4">
            <h4 className="font-medium mb-2">Optimal Ranges:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-600">Cortisol:</span>
                <span>{optimalRanges.cortisol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">α-Amylase:</span>
                <span>{optimalRanges.amylase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">IZOF Score:</span>
                <span>{optimalRanges.izof}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Graph area */}
        <div className="w-2/3 pl-6">
          <div className="relative h-64 border-l border-b">
            {/* Y-axis labels */}
            <div className="absolute -left-36 top-0 h-full flex flex-col justify-between">
              {yAxisCategories.map((category, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-xs text-gray-500 w-24 text-right mr-2">{category.label}</span>
                  <span className="font-medium">{category.value}</span>
                </div>
              ))}
            </div>
            
            {/* X-axis and plot area */}
            <div className="absolute inset-0">
              {/* X-axis labels */}
              <div className="absolute left-0 right-0 bottom-0 translate-y-8 flex justify-between">
                {timePoints.map((point, i) => (
                  <div key={i} className="text-center">
                    <span className="text-xs">{point}</span>
                  </div>
                ))}
              </div>
              
              {/* Plot area with categorical Y positions */}
              <div className="absolute inset-0">
                {/* Flow Zone highlight at End Q3 */}
                <div className="absolute" style={{ left: '76%', top: '2%', width: '8%', height: '25%', border: '1px dashed #10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '2px' }}></div>
                <div className="absolute text-sm font-bold text-green-600" style={{ left: '86%', top: '10%' }}>FLOW ZONE</div>
                
                {/* Plotting the lines - in a real implementation, this would use SVG for proper line drawing */}
                {/* This is just a visual representation for demo purposes */}
                
                {/* Simplified visualization of lines and points */}
                <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                  {timePoints.map((_, i) => {
                    const xPos = `${(100 / (timePoints.length - 1)) * i}%`;
                    return (
                      <React.Fragment key={i}>
                        {/* Cortisol point */}
                        {getYPosition('cortisol', i) === 'High' && (
                          <div className="absolute w-2 h-2 bg-purple-600 rounded-full" 
                            style={{ left: xPos, top: '20%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        {getYPosition('cortisol', i) === 'Medium' && (
                          <div className="absolute w-2 h-2 bg-purple-600 rounded-full" 
                            style={{ left: xPos, top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        
                        {/* α-Amylase point */}
                        {getYPosition('amylase', i) === 'High' && (
                          <div className="absolute w-2 h-2 bg-blue-400 rounded-full" 
                            style={{ left: xPos, top: '16%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        {getYPosition('amylase', i) === 'Medium' && (
                          <div className="absolute w-2 h-2 bg-blue-400 rounded-full" 
                            style={{ left: xPos, top: '48%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        
                        {/* IZOF point */}
                        {getYPosition('izof', i) === 'High' && (
                          <div className="absolute w-2 h-2 bg-blue-600 rounded-full" 
                            style={{ left: xPos, top: '14%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        {getYPosition('izof', i) === 'Medium' && (
                          <div className="absolute w-2 h-2 bg-blue-600 rounded-full" 
                            style={{ left: xPos, top: '46%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        
                        {/* PR Index point */}
                        {getYPosition('prIndex', i) === 'High' && (
                          <div className="absolute w-2 h-2 bg-red-500 rounded-full" 
                            style={{ left: xPos, top: '18%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                        {getYPosition('prIndex', i) === 'Medium' && (
                          <div className="absolute w-2 h-2 bg-red-500 rounded-full" 
                            style={{ left: xPos, top: '52%', transform: 'translate(-50%, -50%)' }}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center mt-16 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-full mr-1"></div>
              <span className="text-sm">Cortisol</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
              <span className="text-sm">α-Amylase</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
              <span className="text-sm">IZOF Score</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className="text-sm">PR Index</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data table */}
      <div className="mt-8 border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Time Point</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cortisol (nmol/L)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">α-Amylase (U/mL)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">IZOF Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">PR Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-gray-50">
              <td className="px-6 py-2 text-sm font-italic">Optimal Range</td>
              <td className="px-6 py-2 text-sm">15-22</td>
              <td className="px-6 py-2 text-sm">75-110</td>
              <td className="px-6 py-2 text-sm">18-22</td>
              <td className="px-6 py-2 text-sm italic">Increasing</td>
              <td className="px-6 py-2 text-sm italic">All in range</td>
            </tr>
            {timePoints.map((point, i) => (
              <tr key={i} className={i === 4 ? "bg-green-50 border border-green-200" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-2 text-sm">{point}</td>
                <td className="px-6 py-2 text-sm text-purple-600">{playerData.cortisol[i]}</td>
                <td className="px-6 py-2 text-sm text-blue-400">{playerData.amylase[i]}</td>
                <td className="px-6 py-2 text-sm text-blue-600">{playerData.izof[i]}</td>
                <td className="px-6 py-2 text-sm text-red-500">{playerData.prIndex[i] || '—'}</td>
                <td className="px-6 py-2 text-sm">
                  {i === 4 ? (
                    <span className="text-green-600 font-medium">FLOW ZONE</span>
                  ) : (
                    <span className="text-green-600">✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-sm text-gray-500 italic mt-4 text-center">
        The qualitative scale enables visualization of diverse physiological and performance metrics on a unified framework.
      </p>
    </div>
  );
};

export default FlowStateGraph;