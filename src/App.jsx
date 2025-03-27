import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameMinutes from './GameMinutes';
// import שאר הדפים...

function App() {
  return (
    <div className="relative">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/game" replace />} />
          <Route path="/game" element={<GameMinutes />} />
          {/* שאר הדפים */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;