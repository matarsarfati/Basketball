import { createContext, useState, useContext, useEffect } from 'react';
import playerModel from '../players/playerModel';

// Create the context
const PlayerContext = createContext();

// Custom hook for using the player context
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

// Provider component
export const PlayerProvider = ({ children }) => {
  // State for players array
  const [players, setPlayers] = useState([]);
  // State for currently selected player
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for errors
  const [error, setError] = useState(null);

  // Load players from localStorage on component mount
  useEffect(() => {
    const loadPlayers = () => {
      try {
        setLoading(true);
        const savedPlayers = localStorage.getItem('basketballTeamPlayers');
        if (savedPlayers) {
          setPlayers(JSON.parse(savedPlayers));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load players from storage');
        setLoading(false);
        console.error('Error loading players:', err);
      }
    };

    loadPlayers();
  }, []);

  // Save players to localStorage whenever they change
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('basketballTeamPlayers', JSON.stringify(players));
    }
  }, [players]);

  // Add a new player
  const addPlayer = (playerData) => {
    const newPlayer = {
      ...playerModel, // Use the model as a base
      ...playerData, // Override with provided data
      id: Date.now().toString(), // Generate a unique ID
    };
    
    setPlayers([...players, newPlayer]);
    return newPlayer;
  };

  // Update an existing player
  const updatePlayer = (id, updatedData) => {
    const updatedPlayers = players.map(player => 
      player.id === id ? { ...player, ...updatedData } : player
    );
    
    setPlayers(updatedPlayers);
    
    // Update selected player if it's the one being updated
    if (selectedPlayer && selectedPlayer.id === id) {
      setSelectedPlayer({ ...selectedPlayer, ...updatedData });
    }
  };

  // Delete a player
  const deletePlayer = (id) => {
    const filteredPlayers = players.filter(player => player.id !== id);
    setPlayers(filteredPlayers);
    
    // Clear selected player if it's the one being deleted
    if (selectedPlayer && selectedPlayer.id === id) {
      setSelectedPlayer(null);
    }
  };

  // Get a player by ID
  const getPlayerById = (id) => {
    return players.find(player => player.id === id) || null;
  };

  // Select a player
  const selectPlayer = (id) => {
    const player = getPlayerById(id);
    setSelectedPlayer(player);
    return player;
  };

  // Clear the selected player
  const clearSelectedPlayer = () => {
    setSelectedPlayer(null);
  };

  // Export all players
  const exportPlayers = () => {
    return JSON.stringify(players);
  };

  // Import players from JSON
  const importPlayers = (playersJson) => {
    try {
      const parsedPlayers = JSON.parse(playersJson);
      if (Array.isArray(parsedPlayers)) {
        setPlayers(parsedPlayers);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to import players: Invalid format');
      console.error('Error importing players:', err);
      return false;
    }
  };

  // Context value
  const value = {
    players,
    selectedPlayer,
    loading,
    error,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    selectPlayer,
    clearSelectedPlayer,
    exportPlayers,
    importPlayers,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
