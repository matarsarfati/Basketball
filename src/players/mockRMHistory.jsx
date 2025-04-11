/**
 * Mock RM (Repetition Maximum) history data
 * 
 * This module provides sample RM test data for each player over time
 * to demonstrate the RMPerformanceChart component.
 */

const mockRMHistory = {
    // Player 1 - Michael Jordan
    '1': [
      {
        date: '2023-06-10',
        data: {
          benchPress: 120,
          squat: 160,
          deadlift: 190
        }
      },
      {
        date: '2023-07-15',
        data: {
          benchPress: 125,
          squat: 165,
          deadlift: 195
        }
      },
      {
        date: '2023-08-22',
        data: {
          benchPress: 130,
          squat: 170,
          deadlift: 200
        }
      },
      {
        date: '2023-09-30',
        data: {
          benchPress: 132,
          squat: 175,
          deadlift: 205
        }
      },
      {
        date: '2023-11-05',
        data: {
          benchPress: 135,
          squat: 180,
          deadlift: 210,
          // Future metrics (placeholders)
          pullDown: 110
        }
      }
    ],
    
    // Player 2 - LeBron James
    '2': [
      {
        date: '2023-06-12',
        data: {
          benchPress: 140,
          squat: 185,
          deadlift: 220
        }
      },
      {
        date: '2023-07-18',
        data: {
          benchPress: 145,
          squat: 190,
          deadlift: 225
        }
      },
      {
        date: '2023-08-25',
        data: {
          benchPress: 150,
          squat: 195,
          deadlift: 235
        }
      },
      {
        date: '2023-10-02',
        data: {
          benchPress: 153,
          squat: 200,
          deadlift: 240
        }
      },
      {
        date: '2023-11-08',
        data: {
          benchPress: 155,
          squat: 205,
          deadlift: 245,
          // Future metrics (placeholders)
          pullDown: 125,
          beepTest: 12.5
        }
      }
    ],
    
    // Player 3 - Stephen Curry
    '3': [
      {
        date: '2023-06-15',
        data: {
          benchPress: 95,
          squat: 140,
          deadlift: 165
        }
      },
      {
        date: '2023-07-20',
        data: {
          benchPress: 100,
          squat: 145,
          deadlift: 170
        }
      },
      {
        date: '2023-08-28',
        data: {
          benchPress: 105,
          squat: 150,
          deadlift: 175
        }
      },
      {
        date: '2023-10-05',
        data: {
          benchPress: 110,
          squat: 155,
          deadlift: 180
        }
      },
      {
        date: '2023-11-10',
        data: {
          benchPress: 115,
          squat: 165,
          deadlift: 190,
          // Future metrics (placeholders)
          pullDown: 95,
          beepTest: 14.2
        }
      }
    ]
  };
  
  export default mockRMHistory;