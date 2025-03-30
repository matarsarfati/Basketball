import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameMinutes from './GameMinutes';
import ManageTeam from "./pages/ManageTeam";
import ManageOpponent from "./pages/ManageOpponent";
function App() {
  return (
    <div className="relative">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/game" replace />} />
          <Route path="/game" element={<GameMinutes />} />
          <Route path="/manage-team" element={<ManageTeam />} />
          <Route path="/manage-opponent" element={<ManageOpponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;