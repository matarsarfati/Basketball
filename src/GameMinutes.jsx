import React, { useState, useEffect } from "react";
import { GameAIProvider } from "./context/GameAIContext.jsx";
import AIChatBox from "./components/AIChatBox.jsx";
import { formatMMSS } from "./utils/timeUtils.js";
import { useNavigate } from "react-router-dom";

// פונקציות עזר לחישוב סיכום המשחק
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

const GameMinutes = () => {
  const [players, setPlayers] = useState([]);
  const [opponents, setOpponents] = useState([]);
  const [time, setTime] = useState(600); // 10 דקות בברירת מחדל
  const [isRunning, setIsRunning] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(''); // שמירת שם הקבוצה היריבה

  useEffect(() => {
    // טעינת השחקנים מהlocalStorage
    const savedPlayers = JSON.parse(localStorage.getItem('myTeam')) || [];
    setPlayers(savedPlayers);

    const savedOpponent = JSON.parse(localStorage.getItem('selectedOpponent')) || '';
    setSelectedOpponent(savedOpponent);

    // טעינת השחקנים של הקבוצה היריבה מהlocalStorage
    const savedOpponents = JSON.parse(localStorage.getItem('opponentTeam')) || [];
    setOpponents(savedOpponents);

    let interval;

    // רק אם השעון רץ, נתעדכן כל שנייה
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0; // עדכון זמן המשחק

          // עדכון הזמן של השחקנים על המגרש
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) => {
              if (player.onCourt) {
                return {
                  ...player,
                  timePlayed: player.timePlayed + 1, // עדכון זמן סה"כ של השחקן
                  continuousRest: 0, // מאפס זמן מנוחה רציף
                };
              } else {
                return {
                  ...player,
                  restTime: player.restTime + 1, // עדכון זמן מנוחה
                  continuousRest: player.continuousRest + 1, // עדכון זמן מנוחה רציף
                };
              }
            })
          );

          // עדכון הזמן של השחקנים היריבים
          setOpponents((prevOpponents) =>
            prevOpponents.map((player) => {
              if (player.onCourt) {
                return {
                  ...player,
                  timePlayed: player.timePlayed + 1, // עדכון זמן סה"כ
                  continuousRest: 0, // מאפס את זמן המנוחה הרציף
                };
              } else {
                return {
                  ...player,
                  restTime: player.restTime + 1, // עדכון זמן מנוחה
                  continuousRest: player.continuousRest + 1, // עדכון זמן מנוחה רציף
                };
              }
            })
          );

          return newTime;
        });
      }, 1000); // עדכון כל שנייה
    } else {
      clearInterval(interval); // עצירת העדכון
    }
    return () => clearInterval(interval); // הקפדה על סיום העדכון
  }, [isRunning]); // הקשבה לשינוי בזמן משחק

  const navigate = useNavigate();

  return (
    <GameAIProvider value={{ players, opponents, gameTime: time, isRunning }}>
      <div className="min-h-screen bg-gray-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-6xl">

          {/* כותרת */}
          <h1 className="text-4xl font-extrabold text-center mb-8">
            🏀 Game Minutes Tracker
          </h1>

          {/* טיימר ראשי */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 rounded-xl shadow-md p-4 mb-6 gap-4">
            <div className="text-6xl font-bold text-blue-400 bg-gray-700 p-4 rounded-lg shadow-md">
              {formatMMSS(time)}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {

  setIsRunning((prev) => !prev); // אם מתחילים את השעון מחדש, מאפסים את הזמן של המשחק
                  
                }}
                className={`${isRunning ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300`}
              >
                {isRunning ? "Stop" : "Start"}
              </button>

              {/* טיים-אאוט */}
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300">
                Timeout
              </button>

              {/* ייצוא ל-PDF */}
              <button
                className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-lg font-semibold transition duration-300"
              >
                Export to PDF
              </button>
            </div>
          </div>

          {/* כפתורים לניהול קבוצה */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/manage-team")}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Manage Team
            </button>
            <button
              onClick={() => navigate("/manage-opponent")}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Manage Opponent
            </button>
          </div>

          {/* טבלת הקבוצה */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md text-sm border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Current Time</th>
                  <th className="px-4 py-2">Total Time</th>
                  <th className="px-4 py-2">Rest Time</th>
                  <th className="px-4 py-2">Continuous Rest</th>
                  <th className="px-4 py-2">Fouls</th>
                  <th className="px-4 py-2">Points</th>
                  <th className="px-4 py-2">Sub</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index} className="border-t border-gray-600 hover:bg-gray-700 transition duration-300">
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2 text-center">
                      {player.onCourt ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.timePlayed)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.totalTime || 0)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.restTime)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.continuousRest)}</td>
                    <td className="px-4 py-2 text-center">{player.fouls}</td>
                    <td className="px-4 py-2 text-center">{player.points}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => togglePlayer(player.name)}
                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                      >
                        {player.onCourt ? "Sub Out" : "Sub In"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* טבלת הקבוצה היריבה */}
          <div className="overflow-x-auto mb-6">
            <h2 className="text-2xl font-semibold mb-4">Opponent Team</h2>
            <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md text-sm border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2">Current Time</th>
                  <th className="px-4 py-2">Total Time</th>
                  <th className="px-4 py-2">Rest Time</th>
                  <th className="px-4 py-2">Continuous Rest</th>
                  <th className="px-4 py-2">Fouls</th>
                  <th className="px-4 py-2">Points</th>
                  <th className="px-4 py-2">Sub</th>
                </tr>
              </thead>
              <tbody>
                {opponents.map((player, index) => (
                  <tr key={index} className="border-t border-gray-600 hover:bg-gray-700 transition duration-300">
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2 text-center">
                      {player.onCourt ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.timePlayed)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.totalTime || 0)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.restTime)}</td>
                    <td className="px-4 py-2 text-center">{formatMMSS(player.continuousRest)}</td>
                    <td className="px-4 py-2 text-center">{player.fouls}</td>
                    <td className="px-4 py-2 text-center">{player.points}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => toggleOpponentPlayer(player.name)}
                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                      >
                        {player.onCourt ? "Sub Out" : "Sub In"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* סיכום המשחק */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Game Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg shadow-md text-sm border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-700 text-gray-300">
                    <th className="px-4 py-2 text-left">Team</th>
                    <th className="px-4 py-2">Total Time</th>
                    <th className="px-4 py-2">Points</th>
                    <th className="px-4 py-2">Fouls</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-600">
                    <td className="px-4 py-2">Your Team</td>
                    <td className="px-4 py-2 text-center">{calculateTotalTime(players)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalPoints(players)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalFouls(players)}</td>
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="px-4 py-2">Opponent Team</td>
                    <td className="px-4 py-2 text-center">{calculateTotalTime(opponents)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalPoints(opponents)}</td>
                    <td className="px-4 py-2 text-center">{calculateTotalFouls(opponents)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <AIChatBox />
          </div>

        </div>
      </div>
    </GameAIProvider>
  );
};

export default GameMinutes;