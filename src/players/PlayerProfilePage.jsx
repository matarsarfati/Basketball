import React, { useState } from 'react';
import PlayerProfile from './PlayerProfile';
import PhysicalDataDemo from './PhysicalDataDemo';
import mockPlayers from './mockPlayers';

/**
 * PlayerProfilePage Component
 * 
 * A demonstration page for the PlayerProfile component that:
 * - Allows selecting different mock players
 * - Displays the selected player's profile
 * - Provides functionality to update player data
 * - Includes a demo of the PhysicalDataForm component
 * 
 * In a real application, this would use the PlayerContext to get actual player data.
 */
const PlayerProfilePage = () => {
  // Mock players data - in a real app this would come from context
  const [players, setPlayers] = useState([...mockPlayers]);
  
  // Currently selected player ID
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || '');
  
  // Get the selected player object
  const selectedPlayer = players.find(player => player.id === selectedPlayerId) || null;
  
  // Handle updating a player
  const handleUpdatePlayer = (updatedPlayer) => {
    // Update the player in our local state
    const updatedPlayers = players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    );
    
    setPlayers(updatedPlayers);
    console.log('Player updated:', updatedPlayer);
  };
  
  // Toggle between profile view and physical data demo
  const [viewMode, setViewMode] = useState('profile'); // 'profile' or 'physicalDemo'
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Player Management</h1>
      
      {/* View Mode Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-center ${
            viewMode === 'profile' 
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setViewMode('profile')}
        >
          Player Profile
        </button>
        <button
          className={`py-2 px-4 text-center ${
            viewMode === 'physicalDemo' 
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setViewMode('physicalDemo')}
        >
          Physical Data Form Demo
        </button>
      </div>
      
      {/* Conditional Content Based on View Mode */}
      {viewMode === 'profile' ? (
        <>
          {/* Player Selection */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <label htmlFor="playerSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select Player:
            </label>
            <select
              id="playerSelect"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} - #{player.jerseyNumber} ({player.position})
                </option>
              ))}
            </select>
          </div>
          
          {/* Player Profile Component */}
          <PlayerProfile 
            player={selectedPlayer} 
            onUpdatePlayer={handleUpdatePlayer}
          />
        </>
      ) : (
        <PhysicalDataDemo />
      )}
    </div>
  );
};

export default PlayerProfilePage;