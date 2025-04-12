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
    { id: 1, name: 'Active Players', value: '3', link: '/profile', icon: 'user-group' },
    { id: 2, name: 'Upcoming Workouts', value: '6', link: '/workouts', icon: 'calendar' },
    { id: 3, name: 'Exercise Library', value: '20+', link: '/gym', icon: 'fire' },
    { id: 4, name: 'Team Health Rating', value: '92%', link: '/wellness', icon: 'heart' },
  ];

  // Icon component to simplify usage
  const Icon = ({ name }) => {
    switch (name) {
      case 'user-group':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'fire':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-israel-blue mb-4">Welcome to the Basketball Team Management System</h1>
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
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-israel-blue bg-opacity-10 p-3 rounded-full text-israel-blue group-hover:bg-israel-blue group-hover:text-white transition-colors duration-300">
                  <Icon name={stat.icon} />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
                  <div className="mt-1 text-3xl font-semibold text-israel-blue">{stat.value}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Feature Sections */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-10">
        <div className="px-4 py-5 sm:px-6 bg-israel-blue text-white">
          <h2 className="text-xl font-semibold">Key Features</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Management */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300 hover:border-israel-blue">
              <h3 className="text-lg font-medium text-israel-blue mb-2">Player Management</h3>
              <p className="text-gray-600 mb-4">
                Create and maintain detailed player profiles, track physical attributes, and monitor performance metrics.
              </p>
              <Link to="/profile" className="text-israel-blue hover:text-israel-blue-dark font-medium flex items-center">
                View Player Profiles
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Workout Planning */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300 hover:border-israel-blue">
              <h3 className="text-lg font-medium text-israel-blue mb-2">Workout Planning</h3>
              <p className="text-gray-600 mb-4">
                Create personalized workout plans, leverage player RM data for optimal training intensity, and schedule team sessions.
              </p>
              <Link to="/workouts" className="text-israel-blue hover:text-israel-blue-dark font-medium flex items-center">
                Create Workouts
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Exercise Library */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300 hover:border-israel-blue">
              <h3 className="text-lg font-medium text-israel-blue mb-2">Exercise Library</h3>
              <p className="text-gray-600 mb-4">
                Access a comprehensive library of basketball-specific exercises with detailed instructions and coaching notes.
              </p>
              <Link to="/gym" className="text-israel-blue hover:text-israel-blue-dark font-medium flex items-center">
                Browse Exercises
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Performance Analytics (Future Feature) */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-300 hover:border-israel-blue">
              <h3 className="text-lg font-medium text-israel-blue mb-2">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">
                Visualize player and team performance metrics over time, identify trends, and make data-driven decisions.
              </p>
              <span className="text-gray-500 font-medium flex items-center">
                Coming Soon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-israel-blue text-white">
          <h2 className="text-xl font-semibold">Getting Started</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ol className="list-decimal ml-6 space-y-3 text-gray-600">
            <li>
              <Link to="/profile" className="text-israel-blue hover:text-israel-blue-dark">
                Create player profiles
              </Link> for your team members
            </li>
            <li>Record player physical data and repetition maximum (RM) values</li>
            <li>
              <Link to="/gym" className="text-israel-blue hover:text-israel-blue-dark">
                Browse the exercise library
              </Link> to understand available training options
            </li>
            <li>
              <Link to="/workouts" className="text-israel-blue hover:text-israel-blue-dark">
                Create personalized workout plans
              </Link> based on player needs and goals
            </li>
            <li>Schedule and assign workouts to players or groups</li>
            <li>Track progress and adjust plans over time based on performance data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;