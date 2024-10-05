import React, { createContext, useContext, useState } from "react";

interface ExperienceContextType {
  experience: number;
  addExperience: (points: number) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(
  undefined
);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [experience, setExperience] = useState<number>(0);

  const addExperience = (points: number) => {
    console.log(`Adding ${points} XP. Current XP: ${experience}`); // Log current XP and points being added
    setExperience((prevExperience) => {
      const newExperience = prevExperience + points;
      console.log(`New XP: ${newExperience}`); // Log updated XP
      return newExperience;
    });
  };

  return (
    <ExperienceContext.Provider value={{ experience, addExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
};
