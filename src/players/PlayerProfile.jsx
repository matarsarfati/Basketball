import React, { useState } from 'react';
import { calculateAge, formatDate } from '../shared/utils/dateUtils';
import PhysicalDataForm from './PhysicalDataForm';
import PlayerProfileCompactRM from './PlayerProfileCompactRM';
import WorkoutHistory from '../workouts/history/WorkoutHistory';
import PlayerLoad from './PlayerLoad';

/**
 * PlayerProfile Component
 * 
 * Displays comprehensive information about a basketball player including:
 * - Personal information (name, position, etc.)
 * - Physical attributes (height, weight, body fat)
 * - Performance metrics (RM data)
 * - Workout history and performance
 * - Load monitoring and management
 * - Injury history
 */
const PlayerProfile = ({ player, onUpdatePlayer }) => {
  // State for physical data edit mode
  const [isEditingPhysicalData, setIsEditingPhysicalData] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // Handle save from the PhysicalDataForm
  const handleSavePhysicalData = (physicalData) => {
    if (onUpdatePlayer && player) {
      onUpdatePlayer({
        ...player,
        ...physicalData
      });
    }
    setIsEditingPhysicalData(false);
  };
  
  // If no player is provided, show a placeholder
  if (!player) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">Select a player to view their profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with player name and basic info */}
      <div className="bg-blue-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <div className="flex items-center mt-2">
              <span className="bg-blue-800 text-sm rounded-full px-3 py-1 mr-2">
                #{player.jerseyNumber || 'N/A'}
              </span>
              <span className="bg-blue-800 text-sm rounded-full px-3 py-1">
                {player.position || 'Position not set'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{calculateAge(player.dateOfBirth)}</div>
            <div className="text-sm opacity-80">Years old</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-100 px-6 py-2 border-b border-gray-200">
        <div className="flex flex-wrap space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-2 text-sm font-medium ${
              activeTab === 'performance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`py-2 px-2 text-sm font-medium ${
              activeTab === 'workouts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`py-2 px-2 text-sm font-medium ${
              activeTab === 'load'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Load
          </button>
          <button
            onClick={() => setActiveTab('injuries')}
            className={`py-2 px-2 text-sm font-medium ${
              activeTab === 'injuries'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Injuries
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-6">
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Data Form */}
            <section className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Physical Data
                </h3>
                {onUpdatePlayer && (
                  <button
                    onClick={() => setIsEditingPhysicalData(!isEditingPhysicalData)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isEditingPhysicalData ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              
              {isEditingPhysicalData ? (
                <PhysicalDataForm
                  initialData={{
                    height: player.height,
                    weight: player.weight,
                    fatPercentage: player.fatPercentage
                  }}
                  onSave={handleSavePhysicalData}
                  onCancel={() => setIsEditingPhysicalData(false)}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Height</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.height ? `${player.height} cm` : 'Not recorded'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.weight ? `${player.weight} kg` : 'Not recorded'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Body Fat</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.fatPercentage ? `${player.fatPercentage}%` : 'Not recorded'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Date of Birth</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.dateOfBirth ? formatDate(player.dateOfBirth) : 'Not recorded'}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Contact Information Section */}
            <section className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-md font-medium mt-1">
                    {player.contact?.email || 'Not provided'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-md font-medium mt-1">
                    {player.contact?.phone || 'Not provided'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="text-md font-medium mt-1">
                    {player.contact?.address || 'Not provided'}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RM Data Section */}
            <section className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                Strength Metrics & Performance
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Current RM Values */}
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Bench Press</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.rmData?.benchPress ? `${player.rmData.benchPress} kg` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Squat</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.rmData?.squat ? `${player.rmData.squat} kg` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Deadlift</div>
                    <div className="text-xl font-semibold mt-1">
                      {player.rmData?.deadlift ? `${player.rmData.deadlift} kg` : 'N/A'}
                    </div>
                  </div>
                  
                  {/* Training Intensity Calculator Teaser */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <div className="text-sm text-gray-500 font-medium mb-2">Training Intensity</div>
                    <p className="text-xs text-gray-600">
                      Use the RM Performance tab to calculate training weights based on intensity percentages.
                    </p>
                  </div>
                </div>
                
                {/* RM Performance Chart */}
                <div className="md:col-span-3">
                  <PlayerProfileCompactRM playerId={player.id} />
                </div>
              </div>
            </section>

            {/* Performance History Section */}
            <section className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
                Recent Performance
              </h3>
              {player.performanceHistory && player.performanceHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left text-sm">Date</th>
                        <th className="py-2 px-4 text-left text-sm">Points</th>
                        <th className="py-2 px-4 text-left text-sm">Rebounds</th>
                        <th className="py-2 px-4 text-left text-sm">Assists</th>
                        <th className="py-2 px-4 text-left text-sm">Steals</th>
                        <th className="py-2 px-4 text-left text-sm">Blocks</th>
                        <th className="py-2 px-4 text-left text-sm">Minutes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {player.performanceHistory.slice(0, 5).map((performance, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-2 px-4 text-sm">{formatDate(performance.date)}</td>
                          <td className="py-2 px-4 text-sm">{performance.points}</td>
                          <td className="py-2 px-4 text-sm">{performance.rebounds}</td>
                          <td className="py-2 px-4 text-sm">{performance.assists}</td>
                          <td className="py-2 px-4 text-sm">{performance.steals}</td>
                          <td className="py-2 px-4 text-sm">{performance.blocks}</td>
                          <td className="py-2 px-4 text-sm">{performance.minutesPlayed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No performance data recorded</p>
              )}
            </section>
          </div>
        )}

        {/* Workouts Tab Content */}
        {activeTab === 'workouts' && (
          <WorkoutHistory playerId={player.id} />
        )}
        
        {/* Load Tab Content */}
        {activeTab === 'load' && (
          <PlayerLoad playerId={player.id} />
        )}

        {/* Injuries Tab Content */}
        {activeTab === 'injuries' && (
          <section className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
              Injury History
            </h3>
            {player.injuries && player.injuries.length > 0 ? (
              <div className="space-y-4">
                {player.injuries.map((injury, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{injury.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{injury.bodyPart} - {injury.severity} severity</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          injury.endDate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {injury.endDate ? 'Recovered' : 'Active'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Start: {formatDate(injury.startDate)}</span>
                        {injury.endDate && <span>End: {formatDate(injury.endDate)}</span>}
                      </div>
                      
                      {injury.notes && (
                        <p className="mt-2 text-gray-700">{injury.notes}</p>
                      )}
                      
                      {injury.treatmentPlan && (
                        <div className="mt-2">
                          <span className="text-gray-500">Treatment: </span>
                          <span className="text-gray-700">{injury.treatmentPlan}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No injury history recorded</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;