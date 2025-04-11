/**
 * Player data model with essential properties for the basketball team management system
 * This model defines the structure for player data throughout the application
 */

const playerModel = {
    id: '', // Unique identifier for the player
    name: '', // Full name of the player
    position: '', // Basketball position (PG, SG, SF, PF, C)
    jerseyNumber: null, // Jersey number
    dateOfBirth: '', // Date of birth
    height: null, // Height in centimeters
    weight: null, // Weight in kilograms
    fatPercentage: null, // Body fat percentage
    
    // Repetition Maximum data for strength assessments
    rmData: {
      benchPress: null, // Bench press 1RM in kg
      squat: null, // Squat 1RM in kg
      deadlift: null, // Deadlift 1RM in kg
    },
    
    // Performance data over time
    performanceHistory: [
      // {
      //   date: '', // Date of performance record
      //   points: 0, // Points scored
      //   rebounds: 0, // Rebounds
      //   assists: 0, // Assists
      //   steals: 0, // Steals
      //   blocks: 0, // Blocks
      //   minutesPlayed: 0, // Minutes played
      // }
    ],
    
    // Injury history
    injuries: [
      // {
      //   type: '', // Type of injury
      //   bodyPart: '', // Affected body part
      //   severity: '', // Severity level
      //   startDate: '', // Date injury occurred
      //   endDate: '', // Date cleared to play
      //   notes: '', // Additional medical notes
      //   treatmentPlan: '', // Prescribed treatment
      // }
    ],
    
    // Contact information
    contact: {
      email: '',
      phone: '',
      address: '',
    },
    
    // Additional info
    notes: '', // General notes about the player
    active: true, // Whether the player is active on the roster
  };
  
  export default playerModel;