import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { PlayerProfilePage } from './players';
import { WorkoutPlanner } from './workouts';
import GymPage from './gym/GymPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  // Active link state for navigation styling
  const [activeLink, setActiveLink] = useState('/');
  
  // Handle link click for active styling
  const handleLinkClick = (path) => {
    setActiveLink(path);
  };
  
  return (
    <PlayerProvider>
      <WorkoutProvider>
        <Router>
        <div className="p-4 m-4 bg-blue-500 text-white rounded">
            This div should be blue with white text if Tailwind is working
          </div>
          <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header with Navigation */}
            <header className="bg-israel-blue text-white shadow-md">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4">
                  <h1 className="text-2xl font-bold mb-4 md:mb-0">Basketball Team Management</h1>
                  
                  <nav className="flex flex-wrap gap-1 md:gap-2">
                    <Link 
                      to="/" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeLink === '/' 
                          ? 'bg-israel-blue-dark text-white' 
                          : 'text-white hover:bg-israel-blue-light'
                      }`}
                      onClick={() => handleLinkClick('/')}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeLink === '/profile' 
                          ? 'bg-israel-blue-dark text-white' 
                          : 'text-white hover:bg-israel-blue-light'
                      }`}
                      onClick={() => handleLinkClick('/profile')}
                    >
                      Player Profiles
                    </Link>
                    <Link 
                      to="/workouts" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeLink === '/workouts' 
                          ? 'bg-israel-blue-dark text-white' 
                          : 'text-white hover:bg-israel-blue-light'
                      }`}
                      onClick={() => handleLinkClick('/workouts')}
                    >
                      Workout Planner
                    </Link>
                    <Link 
                      to="/gym" 
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeLink === '/gym' 
                          ? 'bg-israel-blue-dark text-white' 
                          : 'text-white hover:bg-israel-blue-light'
                      }`}
                      onClick={() => handleLinkClick('/gym')}
                    >
                      Gym & Exercises
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            
            {/* Main Content Area */}
            <main className="flex-grow container mx-auto p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<PlayerProfilePage />} />
                <Route path="/workouts" element={<WorkoutPlanner />} />
                <Route path="/gym" element={<GymPage />} />
              </Routes>
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-100 p-4 text-center text-gray-600 mt-auto border-t border-gray-200">
              <p>Basketball Team Management System &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </Router>
      </WorkoutProvider>
    </PlayerProvider>
  );
}

export default App;