import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MedicalFieldPage.css";
import confetti from "canvas-confetti";

type Level = {
  title: string;
  icon: string; // Icon for each level
  unlocked: boolean;
  stars: number; // Number of stars earned for the level
};

const MedicalFieldPage: React.FC = () => {
  const navigate = useNavigate();
  const handleExploreClick = () => {
    navigate("/experts");
  };
  const handleChatbotClick = () => {
    navigate("/chatbot");
  }; // New handler for chatbot button

  const location = useLocation(); // Access the navigation state

  const [levels, setLevels] = useState<Level[]>([
    { title: "What’s Medicine!?", icon: "🩺", unlocked: true, stars: 0 },
    { title: "Human Anatomy", icon: "🦴", unlocked: false, stars: 0 },
    { title: "Cardiology", icon: "❤️", unlocked: false, stars: 0 },
    { title: "Neurology", icon: "🧠", unlocked: false, stars: 0 },
    { title: "Pediatrics", icon: "🍼", unlocked: false, stars: 0 },
    { title: "Surgery", icon: "🔪", unlocked: false, stars: 0 },
    { title: "Radiology", icon: "🩻", unlocked: false, stars: 0 },
    { title: "Psychiatry", icon: "💭", unlocked: false, stars: 0 },
    { title: "Immunology", icon: "🦠", unlocked: false, stars: 0 },
    { title: "Oncology", icon: "🧬", unlocked: false, stars: 0 },
    { title: "Pharmacology", icon: "💊", unlocked: false, stars: 0 },
    { title: "Public Health", icon: "🏥", unlocked: false, stars: 0 },
  ]);

  // Get stars from the state passed from WhatsMedicine
  useEffect(() => {
    if (location.state && location.state.stars) {
      const starsEarned = location.state.stars;
      setLevels((prevLevels) =>
        prevLevels.map((level, index) => {
          if (index === 0) {
            // Update the first level "What's Medicine!?" with the stars
            return { ...level, stars: starsEarned };
          }
          return level;
        })
      );
    }
  }, [location.state]);

  useEffect(() => {
    // Automatically unlock the "Human Anatomy" level if "What's Medicine!?" level has at least 1 star
    if (levels[0].stars > 0 && !levels[1].unlocked) {
      setLevels((prevLevels) =>
        prevLevels.map((level, index) => {
          if (index === 1) {
            return { ...level, unlocked: true };
          }
          return level;
        })
      );
    }
  }, [levels[0].stars]);

  const handleLevelClick = (index: number) => {
    if (levels[index].unlocked) {
      playSound("/src/assets/sounds/click.mp3");
      navigate(
        `/medical/${levels[index].title.replace(/\s/g, "").toLowerCase()}`
      );

      if (index < levels.length - 1) {
        setLevels((prevLevels) =>
          prevLevels.map((level, i) => {
            if (i === index) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
              return { ...level, stars: Math.min(3, level.stars + 1) };
            } else if (i === index + 1) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        );
      }
    }
  };

  const playSound = (src: string) => {
    const sound = new Audio(src);
    sound.play();
  };

  return (
    <div className="medical-container">
      <h1 className="title">Medical Field Adventure</h1>

      <div className="explore-container">
        <button className="explore-button" onClick={handleExploreClick}>
          <img
            src="/src/components/images/ask.jpg" // Replace with your image path
            alt="Doctor"
            className="explore-button-img"
          />
        </button>
        <p className="explore-text">
          Want to explore the world of doctors? Click the button and let’s
          start!
        </p>
      </div>
      <div className="level-grid">
        {levels.map((level, index) => (
          <div
            key={index}
            className="level-container"
            style={{
              animation: level.unlocked ? "bounce 1s ease-in-out" : "none",
            }}
          >
            <button
              title={`Learn about ${level.title}`}
              onClick={() => handleLevelClick(index)}
              className={`level-button ${
                level.unlocked ? "unlocked" : "locked"
              }`}
              disabled={!level.unlocked}
              style={{
                backgroundColor: level.unlocked ? "#FFD700" : "#B0BEC5", // Gold for unlocked, grey for locked
              }}
            >
              <span className="level-icon">{level.icon}</span>
              {level.title}
              {!level.unlocked && <span className="lock-icon">🔒</span>}
            </button>

            {/* Star display based on score */}
            <div className="level-stars">
              {Array.from({ length: 3 }, (_, starIndex) => (
                <span
                  key={starIndex}
                  className={`star ${
                    starIndex < level.stars ? "earned" : "unearned"
                  }`}
                  style={{
                    color: starIndex < level.stars ? "#FFD700" : "#E0E0E0",
                    fontSize: "1.5rem",
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* New Chatbot Button */}
      <button className="chatbot-button" onClick={handleChatbotClick}>
        Open Chatbot 🤖
      </button>
    </div>
  );
};

export default MedicalFieldPage;
