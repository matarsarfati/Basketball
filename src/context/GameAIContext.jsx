// src/context/GameAIContext.jsx
import React, { createContext, useContext } from 'react';

// יצירת הקונטקסט
const GameAIContext = createContext();

// קומפוננטה שעוטפת את התוכן ומעבירה אליו את הנתונים
export const GameAIProvider = ({ value, children }) => (
  <GameAIContext.Provider value={value}>
    {children}
  </GameAIContext.Provider>
);

// הוק נוח לשימוש בתוך קומפוננטות אחרות
export const useGameAI = () => useContext(GameAIContext);