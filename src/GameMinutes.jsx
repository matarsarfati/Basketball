import React, { useState, useEffect } from 'react';
import { GameAIProvider } from './context/GameAIContext.jsx'; // ✅ נתיב נכון
import AIChatBox from './components/AIChatBox.jsx';
import { formatMMSS } from "./utils/timeUtils.js";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const GameMinutes = () => {
  const [players, setPlayers] = useState([]);
  const [opponents, setOpponents] = useState([]);
  const [time, setTime] = useState(600); // 10 דקות בברירת מחדל
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // ✅ פונקציה להוספת שחקנית חדשה
  const addPlayer = (name) => {
    setPlayers([...players, { name, timePlayed: 0, fouls: 0, points: 0, onCourt: false }]);
  };

  // ✅ פונקציה להוספת שחקן יריב
  const addOpponent = (name) => {
    setOpponents([...opponents, { name, timePlayed: 0, fouls: 0, points: 0 }]);
  };

  // ✅ פונקציה להחלפת שחקנית על/מהספסל
  const togglePlayer = (name) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.name === name
          ? { ...player, onCourt: !player.onCourt }
          : player
      )
    );
  };
  return (
    <GameAIProvider value={{ players, opponents, gameTime: time, isRunning }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex justify-center">
        <div className="w-full max-w-6xl text-gray-900 dark:text-white">

          {/* ✅ כותרת משודרגת */}
          <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">
            🏀 Game Minutes Tracker
          </h1>

          {/* ⏱️ טיימר ראשי */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 gap-4">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
              {formatMMSS(time)}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {/* 🎮 כפתור התחל/עצור */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`${
                  isRunning ? 'bg-red-500' : 'bg-green-500'
                } text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105`}
              >
                {isRunning ? 'Stop' : 'Start'}
              </button>

              {/* ⏱️ כפתור טיים-אאוט */}
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300">
                Timeout
              </button>

              {/* 📄 כפתור ייצוא ל־PDF */}
              <button
                onClick={() => exportToPDF()}
                className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300"
              >
                Export to PDF
              </button>
            </div>
          </div>
                    {/* ⚽️ אזור ניהול קבוצות */}
                    <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Team</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Player name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="playerName"
              />
              <button
                onClick={() => addPlayer(document.getElementById('playerName').value)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition duration-300"
              >
                Add Player
              </button>
            </div>
          </div>

          {/* 🏀 טבלת הקבוצה */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Current Time</th>
                  <th className="px-4 py-2">Total Time</th>
                  <th className="px-4 py-2">Fouls</th>
                  <th className="px-4 py-2">Points</th>
                  <th className="px-4 py-2">Sub</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index} className="border-t border-gray-300 dark:border-gray-600">
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2 text-center">
                      {player.onCourt ? '✅' : '❌'}
                    </td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.timePlayed)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.totalTime || 0)}</td>
                    <td className="px-4 py-2 text-center">{player.fouls}</td>
                    <td className="px-4 py-2 text-center">{player.points}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => togglePlayer(player.name)}
                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                      >
                        {player.onCourt ? 'Sub Out' : 'Sub In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                    {/* 📊 טבלת סיכום המשחק */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Game Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm border-collapse border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="px-4 py-2 text-left">Team</th>
                    <th className="px-4 py-2">Total Time</th>
                    <th className="px-4 py-2">Points</th>
                    <th className="px-4 py-2">Fouls</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="px-4 py-2">Your Team</td>
                    <td className="px-4 py-2 text-center">{calculateTotalTime(players)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalPoints(players)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalFouls(players)}</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="px-4 py-2">Opponent Team</td>
                    <td className="px-4 py-2 text-center">{calculateTotalTime(opponents)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalPoints(opponents)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalFouls(opponents)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 🤖 תיבת השיח של AI */}
          <div className="mt-8">
            <AIChatBox />
          </div>
        </div>
      </div>
    </GameAIProvider>
  );
};

// 📄 פונקציות עזר
const calculateTotalTime = (team) => {
  return formatMMSS(
    team.reduce((total, player) => total + (player.timePlayed || 0), 0)
  );
};

const calculateTotalPoints = (team) => {
  return team.reduce((total, player) => total + (player.points || 0), 0);
};

const calculateTotalFouls = (team) => {
  return team.reduce((total, player) => total + (player.fouls || 0), 0);
};

// 📤 פונקציה לייצוא PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text('Game Summary', 10, 10);
  doc.save('game-summary.pdf');
};

export default GameMinutes;