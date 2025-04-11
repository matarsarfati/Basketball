import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HomePage Component
 * 
 * A dashboard/welcome page that serves as the main landing page for the
 * Basketball Team Management System. It provides an overview of the system's
 * features and quick navigation to key sections.
 */
const HomePage = () => {
  // Sample stats for the dashboard
  const stats = [
    { id: 1, name: 'Active Players', value: '3', link: '/profile' },
    { id: 2, name: 'Upcoming Workouts', value: '6', link: '/workouts' },
    { id: 3, name: 'Exercise Library', value: '20+', link: '/exercises' },
    { id: 4, name: 'Team Health Rating', value: '92%', link: '/wellness' },
  ];

  return (
    <div className="py-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Basketball Team Management System</h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          A comprehensive platform for coaches and staff to manage player profiles, 
          create personalized workouts, track performance, and monitor team wellness.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.id}
            to={stat.link}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature Sections */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-10">
        <div className="px-4 py-5 sm:px-6 bg-blue-700 text-white">
          <h2 className="text-xl font-semibold">Key Features</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Management */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Player Management</h3>
              <p className="text-gray-600 mb-4">
                Create and maintain detailed player profiles, track physical attributes, and monitor performance metrics.
              </p>
              <Link to="/profile" className="text-blue-600 hover:text-blue-800 font-medium">
                View Player Profiles →
              </Link>
            </div>

            {/* Workout Planning */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workout Planning</h3>
              <p className="text-gray-600 mb-4">
                Create personalized workout plans, leverage player RM data for optimal training intensity, and schedule team sessions.
              </p>
              <Link to="/workouts" className="text-blue-600 hover:text-blue-800 font-medium">
                Create Workouts →
              </Link>
            </div>

            {/* Exercise Library */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Exercise Library</h3>
              <p className="text-gray-600 mb-4">
                Access a comprehensive library of basketball-specific exercises with detailed instructions and coaching notes.
              </p>
              <Link to="/exercises" className="text-blue-600 hover:text-blue-800 font-medium">
                Browse Exercises →
              </Link>
            </div>

            {/* Performance Analytics (Future Feature) */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">
                Visualize player and team performance metrics over time, identify trends, and make data-driven decisions.
              </p>
              <span className="text-gray-500 font-medium">(Coming Soon)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-700 text-white">
          <h2 className="text-xl font-semibold">Getting Started</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ol className="list-decimal ml-6 space-y-2 text-gray-600">
            <li><Link to="/profile" className="text-blue-600 hover:text-blue-800">Create player profiles</Link> for your team members</li>
            <li>Record player physical data and repetition maximum (RM) values</li>
            <li><Link to="/exercises" className="text-blue-600 hover:text-blue-800">Browse the exercise library</Link> to understand available training options</li>
            <li><Link to="/workouts" className="text-blue-600 hover:text-blue-800">Create personalized workout plans</Link> based on player needs and goals</li>
            <li>Schedule and assign workouts to players or groups</li>
            <li>Track progress and adjust plans over time based on performance data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;