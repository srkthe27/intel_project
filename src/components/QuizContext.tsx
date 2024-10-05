// QuizContext.tsx
import React, { createContext, useState, ReactNode } from "react";

type QuizContextType = {
  score: number;
  experience: number;
  setScore: (score: number) => void;
  setExperience: (experience: number) => void;
};

export const QuizContext = createContext<QuizContextType>({
  score: 0,
  experience: 0,
  setScore: () => {},
  setExperience: () => {},
});

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [score, setScore] = useState(0);
  const [experience, setExperience] = useState(0);

  return (
    <QuizContext.Provider
      value={{ score, experience, setScore, setExperience }}
    >
      {children}
    </QuizContext.Provider>
  );
};
