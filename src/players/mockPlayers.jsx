/**
 * Mock player data for development and testing
 * This provides sample data to use while building player-related components
 */

const mockPlayers = [
    {
      id: '1',
      name: 'Michael Jordan',
      position: 'SG',
      jerseyNumber: 23,
      dateOfBirth: '1963-02-17',
      height: 198, // cm
      weight: 98, // kg
      fatPercentage: 7.2,
      
      rmData: {
        benchPress: 135,
        squat: 180,
        deadlift: 210,
      },
      
      performanceHistory: [
        {
          date: '2023-11-12',
          points: 32,
          rebounds: 6,
          assists: 5,
          steals: 3,
          blocks: 1,
          minutesPlayed: 36,
        },
        {
          date: '2023-11-15',
          points: 28,
          rebounds: 8,
          assists: 7,
          steals: 2,
          blocks: 0,
          minutesPlayed: 34,
        },
        {
          date: '2023-11-18',
          points: 41,
          rebounds: 10,
          assists: 4,
          steals: 1,
          blocks: 2,
          minutesPlayed: 38,
        },
      ],
      
      injuries: [
        {
          type: 'Ankle Sprain',
          bodyPart: 'Right Ankle',
          severity: 'Moderate',
          startDate: '2023-10-05',
          endDate: '2023-10-25',
          notes: 'Grade 2 inversion ankle sprain during practice',
          treatmentPlan: 'Rest, ice, compression, elevation, followed by gradual return to play',
        },
      ],
      
      contact: {
        email: 'michael.jordan@example.com',
        phone: '(555) 123-4567',
        address: '123 Championship Dr, Chicago, IL',
      },
      
      notes: 'Team captain, exceptional leader both on and off the court.',
      active: true,
    },
    {
      id: '2',
      name: 'LeBron James',
      position: 'SF',
      jerseyNumber: 6,
      dateOfBirth: '1984-12-30',
      height: 206, // cm
      weight: 113, // kg
      fatPercentage: 8.5,
      
      rmData: {
        benchPress: 155,
        squat: 205,
        deadlift: 245,
      },
      
      performanceHistory: [
        {
          date: '2023-11-10',
          points: 27,
          rebounds: 12,
          assists: 10,
          steals: 1,
          blocks: 2,
          minutesPlayed: 38,
        },
        {
          date: '2023-11-14',
          points: 33,
          rebounds: 8,
          assists: 14,
          steals: 2,
          blocks: 1,
          minutesPlayed: 40,
        },
        {
          date: '2023-11-16',
          points: 25,
          rebounds: 7,
          assists: 8,
          steals: 3,
          blocks: 0,
          minutesPlayed: 36,
        },
      ],
      
      injuries: [
        {
          type: 'Groin Strain',
          bodyPart: 'Left Groin',
          severity: 'Mild',
          startDate: '2023-09-18',
          endDate: '2023-09-30',
          notes: 'Experienced discomfort during scrimmage',
          treatmentPlan: 'Reduced training load, physical therapy, and massage',
        },
        {
          type: 'Back Spasms',
          bodyPart: 'Lower Back',
          severity: 'Mild',
          startDate: '2023-11-20',
          endDate: null,
          notes: 'Recurring issue exacerbated during last game',
          treatmentPlan: 'Heat treatment, massage therapy, core strengthening exercises',
        },
      ],
      
      contact: {
        email: 'lebron.james@example.com',
        phone: '(555) 987-6543',
        address: '456 MVP Lane, Los Angeles, CA',
      },
      
      notes: 'Excellent court vision and leadership. Requires special recovery protocols after games.',
      active: true,
    },
    {
      id: '3',
      name: 'Stephen Curry',
      position: 'PG',
      jerseyNumber: 30,
      dateOfBirth: '1988-03-14',
      height: 188, // cm
      weight: 86, // kg
      fatPercentage: 6.8,
      
      rmData: {
        benchPress: 115,
        squat: 165,
        deadlift: 190,
      },
      
      performanceHistory: [
        {
          date: '2023-11-11',
          points: 35,
          rebounds: 4,
          assists: 6,
          steals: 2,
          blocks: 0,
          minutesPlayed: 34,
        },
        {
          date: '2023-11-13',
          points: 42,
          rebounds: 5,
          assists: 8,
          steals: 1,
          blocks: 0,
          minutesPlayed: 36,
        },
        {
          date: '2023-11-17',
          points: 38,
          rebounds: 3,
          assists: 7,
          steals: 4,
          blocks: 1,
          minutesPlayed: 32,
        },
      ],
      
      injuries: [],
      
      contact: {
        email: 'stephen.curry@example.com',
        phone: '(555) 789-0123',
        address: '789 Three Point Blvd, San Francisco, CA',
      },
      
      notes: 'Exceptional shooter. Follows specialized training program for ankle stability.',
      active: true,
    }
  ];
  
  export default mockPlayers;
  