// src/pages/FlowStatePage.jsx
import React from 'react';
import FlowStateGraphSVG from '../components/FlowStateGraphSVG';

const FlowStatePage = () => {
  // Game data points for the table
  const timePoints = ['Pre-Game', 'Start Q1', 'End Q1', 'Halftime', 'End Q3', 'End Game'];
  
  // Player metrics data
  const playerData = {
    cortisol: [18, 20, 21, 20, 19, 18],
    amylase: [90, 95, 100, 104, 108, 102],
    izof: [19, 20, 21, 22, 22, 21],
    prIndex: [null, 6.8, 7.9, 9.2, 10.6, 10.1]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Jason Crawford - Game Performance Monitoring</h1>
        <h2 className="text-lg text-center mb-6 text-gray-600">Point Guard - Flow State Monitoring</h2>
        
        {/* Display the SVG graph */}
        <FlowStateGraphSVG />
        
        {/* Data table */}
        <div className="mt-8 overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Time Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Cortisol
                  <span className="block text-xs normal-case font-normal text-gray-500">(nmol/L)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  α-Amylase
                  <span className="block text-xs normal-case font-normal text-gray-500">(U/mL)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">IZOF Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">PR Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50 italic">
                <td className="px-6 py-2 text-sm">Optimal Range</td>
                <td className="px-6 py-2 text-sm">15-22</td>
                <td className="px-6 py-2 text-sm">75-110</td>
                <td className="px-6 py-2 text-sm">18-22</td>
                <td className="px-6 py-2 text-sm">Increasing</td>
                <td className="px-6 py-2 text-sm">All in range</td>
              </tr>
              {timePoints.map((point, i) => (
                <tr 
                  key={i} 
                  className={i === 4 ? "bg-green-50 border-green-200" : (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                >
                  <td className="px-6 py-2 text-sm">{point}</td>
                  <td className="px-6 py-2 text-sm text-purple-600">{playerData.cortisol[i]}</td>
                  <td className="px-6 py-2 text-sm text-blue-400">{playerData.amylase[i]}</td>
                  <td className="px-6 py-2 text-sm text-green-600">{playerData.izof[i]}</td>
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
          Performance monitoring demonstrates sustained optimal psychological and physiological state
        </p>
      </div>
      
      {/* Optional: Player Optimal Values Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Optimal Values for Basketball Player</h2>
        
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-lg font-medium text-gray-900" colSpan="3">
                  Jason Crawford - Point Guard
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Measurement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Optimal Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Units</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-purple-600">Cortisol</td>
                <td className="px-6 py-4 text-sm">15 - 22</td>
                <td className="px-6 py-4 text-sm">nmol/L</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-blue-400">α-Amylase</td>
                <td className="px-6 py-4 text-sm">75 - 110</td>
                <td className="px-6 py-4 text-sm">U/mL</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-green-600">IZOF Score</td>
                <td className="px-6 py-4 text-sm">18 - 22</td>
                <td className="px-6 py-4 text-sm">points</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FlowStatePage;