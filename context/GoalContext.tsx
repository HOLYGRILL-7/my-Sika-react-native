import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Goal = {
    id: string;
    name: string;
    saved: number;
    target: number;
    deadline: string;
    status: "On Track" | "Behind";
    icon: "school" | "phone" | "shield";
};

const initialGoals: Goal[] = [
    {
        id: "1",
        name: "School Fees",
        saved: 1350,
        target: 2000,
        deadline: "Apr 30, 2026",
        status: "On Track",
        icon: "school",
    },
    {
        id: "2",
        name: "New Phone",
        saved: 400,
        target: 1500,
        deadline: "Jun 15, 2026",
        status: "Behind",
        icon: "phone",
    },
    {
        id: "3",
        name: "Emergency Fund",
        saved: 800,
        target: 5000,
        deadline: "Dec 31, 2026",
        status: "On Track",
        icon: "shield",
    },
];

type GoalContextType = {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  clearGoals: () => void;
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  };

  const clearGoals = () => {
    setGoals([]);
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, clearGoals }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
