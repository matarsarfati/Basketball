import React, { useState } from 'react';
import PhysicalDataForm from './PhysicalDataForm';
import mockPlayers from './mockPlayers';

/**
 * PhysicalDataDemo Component
 * 
 * A demonstration component to showcase the PhysicalDataForm functionality:
 * - Select a player from mock data
 * - Edit their physical data
 * - See the changes displayed
 * - Switch between read-only and edit modes
 */
const PhysicalDataDemo = () => {
  // Get the first player from mock data as initial selection
  const [selectedPlayerId, setSelectedPlayerId] = useState(mockPlayers[0]?.id || '');
  
  // Find the selected player
  const selectedPlayerOriginal = mockPlayers.find(player => player.id === selectedPlayerId) || null;
  
  // Create a copy of the selected player to track changes
  const [playerData, setPlayerData] = useState({
    height: selectedPlayerOriginal?.height || '',
    weight: selectedPlayerOriginal?.weight || '',
    fatPercentage: selectedPlayerOriginal?.fatPercentage || ''
  });
  
  // Track edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // When player selection changes, update the player data
  const handlePlayerChange = (e) => {
    const newPlayerId = e.target.value;
    setSelectedPlayerId(newPlayerId);
    
    const newPlayer = mockPlayers.find(player => player.id === newPlayerId) || null;
    setPlayerData({
      height: newPlayer?.height || '',
      weight: newPlayer?.weight || '',
      fatPercentage: newPlayer?.fatPercentage || ''
    });
    
    // Exit edit mode when changing players
    setIsEditing(false);
  };
  
  // Handle save from the PhysicalDataForm
  const handleSave = (newData) => {
    setPlayerData(newData);
    setIsEditing(false);
    
    // In a real app, we would update the player in context or call an API here
    console.log('Saved physical data for player:', selectedPlayerId, newData);
  };
  
  // Handle cancel from the PhysicalDataForm
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Player Physical Data</h1>
      
      {/* Player Selection */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label htmlFor="playerSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select Player:
        </label>
        <select
          id="playerSelect"
          value={selectedPlayerId}
          onChange={handlePlayerChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {mockPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name} - #{player.jerseyNumber} ({player.position})
            </option>
          ))}
        </select>
      </div>
      
      {/* Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleEditMode}
          className={`px-4 py-2 rounded-md ${
            isEditing 
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Physical Data'}
        </button>
      </div>
      
      {/* Physical Data Form */}
      <PhysicalDataForm
        initialData={playerData}
        onSave={handleSave}
        onCancel={handleCancel}
        readOnly={!isEditing}
      />
      
      {/* Data Display (to show current state) */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
          Current Physical Data (State)
        </h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          {JSON.stringify(playerData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PhysicalDataDemo;
