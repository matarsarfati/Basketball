import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { WeeklyPlanningProvider } from './context/WeeklyPlanningContext';
import { PlayerProfilePage } from './players';
import { WorkoutPlanner } from './workouts';
import GymPage from './gym/GymPage';
import HomePage from './pages/HomePage';
import WeeklyPlanningPage from './pages/WeeklyPlanningPage';
import FlowStatePage from './pages/FlowStatePage'; // Import the new page
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
        <WeeklyPlanningProvider>
          <Router>
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
                        to="/weekly-planning" 
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          activeLink === '/weekly-planning' 
                            ? 'bg-israel-blue-dark text-white' 
                            : 'text-white hover:bg-israel-blue-light'
                        }`}
                        onClick={() => handleLinkClick('/weekly-planning')}
                      >
                        Weekly Planning
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
                      {/* New Flow State Analysis Link */}
                      <Link 
                        to="/flow-state" 
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          activeLink === '/flow-state' 
                            ? 'bg-israel-blue-dark text-white' 
                            : 'text-white hover:bg-israel-blue-light'
                        }`}
                        onClick={() => handleLinkClick('/flow-state')}
                      >
                        Flow State Analysis
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
                  <Route path="/weekly-planning" element={<WeeklyPlanningPage />} />
                  <Route path="/flow-state" element={<FlowStatePage />} /> {/* New Route */}
                </Routes>
              </main>
              
              {/* Footer */}
              <footer className="bg-gray-100 p-4 text-center text-gray-600 mt-auto border-t border-gray-200">
                <p>Basketball Team Management System &copy; {new Date().getFullYear()}</p>
              </footer>
            </div>
          </Router>
        </WeeklyPlanningProvider>
      </WorkoutProvider>
    </PlayerProvider>
  );
}

export default App;