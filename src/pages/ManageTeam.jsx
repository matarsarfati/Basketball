import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  // הטעינת הקבוצה שהשתמרה מ-localStorage
  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem('myTeam')) || [];
    setTeam(savedTeam);
  }, []);

  const addPlayer = () => {
    if (playerName.trim()) {
      setTeam([...team, { name: playerName, timePlayed: 0, fouls: 0, points: 0, onCourt: false, selectedForGame: true }]);
      setPlayerName('');
    }
  };

  // פונקציה להסרת שחקנית מהקבוצה
  const removePlayer = (name) => {
    setTeam(team.filter(player => player.name !== name));
  };

  // פונקציה לשמירה וניווט חזרה
  const saveTeam = () => {
    localStorage.setItem('myTeam', JSON.stringify(team));
    navigate('/game');
  };

  // עדכון אם השחקן נבחר למשחק
  const togglePlayerForGame = (name) => {
    setTeam(team.map(player =>
      player.name === name ? { ...player, selectedForGame: !player.selectedForGame } : player
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Manage Your Team</h1>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Add Player Name"
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={addPlayer}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Player
        </button>
      </div>

      <ul className="list-disc">
        {team.map((player, index) => (
          <li key={index} className="text-lg flex justify-between items-center">
            <span>{player.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => togglePlayerForGame(player.name)}
                className={`${
                  player.selectedForGame ? 'bg-green-500' : 'bg-gray-400'
                } text-white px-2 py-1 rounded-lg`}
              >
                {player.selectedForGame ? 'In Game' : 'Not in Game'}
              </button>
              <button
                onClick={() => removePlayer(player.name)}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={saveTeam}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Save Team
      </button>
    </div>
  );
};

export default ManageTeam;