import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageOpponent = () => {
  const [teams, setTeams] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('');
  const [opponentPlayers, setOpponentPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedTeams = JSON.parse(localStorage.getItem('opponentTeams')) || {};
    setTeams(savedTeams);
  }, []);

  // פונקציה להוספת קבוצה
  const addTeam = (teamName) => {
    if (teamName.trim() && !teams[teamName]) {
      setTeams({ ...teams, [teamName]: [] });
    }
  };

  // פונקציה להוספת שחקן לקבוצה נבחרת
  const addPlayerToSelectedTeam = () => {
    if (playerName.trim() && !opponentPlayers.some(player => player.name === playerName)) {
      setOpponentPlayers([...opponentPlayers, { name: playerName, onCourt: false }]);
      setPlayerName('');
    }
  };

  // פונקציה להסרת שחקן מקבוצה
  const removePlayer = (name) => {
    setOpponentPlayers(opponentPlayers.filter(player => player.name !== name));
  };

  // פונקציה לשמירה והחזרת המידע ל־localStorage
  const saveTeam = () => {
    const updatedTeams = { ...teams, [selectedTeam]: opponentPlayers };
    setTeams(updatedTeams);
    localStorage.setItem('opponentTeams', JSON.stringify(updatedTeams));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Manage Opponent Team</h1>

      {/* אפשרות להוסיף קבוצה */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Add Team Name"
          className="px-4 py-2 border rounded-lg"
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={() => addTeam(playerName)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Add Team
        </button>
      </div>

      {/* בחר קבוצה מהרשימה */}
      <div className="mb-4">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Select a Team</option>
          {Object.keys(teams).map((teamName, index) => (
            <option key={index} value={teamName}>{teamName}</option>
          ))}
        </select>
      </div>

      {/* אם קבוצה נבחרה, הצג את השחקנים */}
      {selectedTeam && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Edit Players for {selectedTeam}</h2>
          <ul>
            {opponentPlayers.map((player, index) => (
              <li key={index} className="flex items-center gap-2 mb-2">
                <span>{player.name}</span>
                <button onClick={() => removePlayer(player.name)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg">
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* הוספת שחקן */}
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Add Player Name"
              className="px-4 py-2 border rounded-lg"
            />
            <button onClick={addPlayerToSelectedTeam} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add Player
            </button>
          </div>

          {/* כפתור שמירה */}
          <button onClick={saveTeam} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            Save Team
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageOpponent;