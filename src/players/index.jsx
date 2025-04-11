/**
 * Players Module
 * This module handles all player-related functionality including:
 * - Player CRUD operations
 * - Player profiles
 * - Player statistics
 * - Player performance tracking
 * - Physical data management
 * - RM performance visualization
 */

// Re-export player model
export { default as playerModel } from './playerModel';

// Export player components
export { default as PlayerProfile } from './PlayerProfile';
export { default as PlayerProfilePage } from './PlayerProfilePage';
export { default as mockPlayers } from './mockPlayers';
export { default as PhysicalDataForm } from './PhysicalDataForm';
export { default as PhysicalDataDemo } from './PhysicalDataDemo';
export { default as RMPerformanceChart } from './RMPerformanceChart';
export { default as RMPerformanceDemo } from './RMPerformanceDemo';
export { default as mockRMHistory } from './mockRMHistory';
export { default as PlayerProfileCompactRM } from './PlayerProfileCompactRM';

// Additional components to be created
// export { default as PlayerList } from './PlayerList';
// export { default as PlayerForm } from './PlayerForm';