import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EngineeringPage.css";
import confetti from "canvas-confetti";

type Level = {
  title: string;
  unlocked: boolean;
  stars: number; // Number of stars earned for the level
};

const EngineeringPage: React.FC = () => {
  const navigate = useNavigate();
  const handleExploreClick = () => {
    navigate("/experts");
  };
  const location = useLocation(); // Access the navigation state

  const [levels, setLevels] = useState<Level[]>([
    { title: "What's Engineering!?", unlocked: true, stars: 0 },
    { title: "Types", unlocked: false, stars: 0 },
    { title: "Hardware", unlocked: false, stars: 0 },
    { title: "Software", unlocked: false, stars: 0 },
    { title: "Automobiles", unlocked: false, stars: 0 },
    { title: "Architecture", unlocked: false, stars: 0 },
    { title: "Biotech", unlocked: false, stars: 0 },
    { title: "Cyber Security", unlocked: false, stars: 0 },
    { title: "Mathematics’ Role", unlocked: false, stars: 0 },
    { title: "Startups", unlocked: false, stars: 0 },
    { title: "Space Tech", unlocked: false, stars: 0 },
    { title: "Sustainable Tech", unlocked: false, stars: 0 },
  ]);

  // Get stars from the state passed from WhatsEngineering
  useEffect(() => {
    if (location.state && location.state.stars) {
      const starsEarned = location.state.stars;
      setLevels((prevLevels) =>
        prevLevels.map((level, index) => {
          if (index === 0) {
            // Update the first level "What's Engineering!?" with the stars
            return { ...level, stars: starsEarned };
          }
          return level;
        })
      );
    }
  }, [location.state]);

  useEffect(() => {
    // Automatically unlock the "Types" level if "What's Engineering!?" level has at least 1 star
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
  
      // If the user clicks on the "What's Engineering!?" level
      if (index === 0) {
        navigate(`/engineer/${levels[index].title.replace(/\s/g, "").toLowerCase()}`);
        
        // Update stars and unlock next level
        setLevels((prevLevels) => {
          const newLevels = [...prevLevels];
          newLevels[index].stars = Math.min(3, newLevels[index].stars + 1);
          // Unlock the next level
          if (index < newLevels.length - 1) {
            newLevels[index + 1].unlocked = true;
          }
          return newLevels;
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  
      // If the user clicks on the "Types" level
      } else if (index === 1) {
        navigate(`/engineer/types`, { state: { stars: levels[0].stars } });
      }
    }
  };
  

  const playSound = (src: string) => {
    const sound = new Audio(src);
    sound.play();
  };

  return (
    <div className="engineering-container">
      <h1 className="title">Engineering</h1>
      <div className="explore-container">
        <button className="explore-button" onClick={handleExploreClick}>
          <img
            src="/src/components/images/ask.jpg" // Replace with your image path
            alt="Engineer"
            className="explore-button-img"
          />
        </button>
        <p className="explore-text">
          Want to explore about the life of an Engineer? Click this Button and
          Let's get Started!
        </p>
      </div>
      <div className="level-grid">
        {levels.map((level, index) => (
          <div key={index} className="level-container">
            <button
              title={`Learn about ${level.title}`}
              onClick={() => handleLevelClick(index)}
              className={`level-button ${
                level.unlocked ? "unlocked" : "locked"
              }`}
              disabled={!level.unlocked}
            >
              {level.title}
              {!level.unlocked && <span className="lock-icon">🔒</span>}
            </button>

            <div className="level-stars">
              {Array.from({ length: 3 }, (_, starIndex) => (
                <span
                  key={starIndex}
                  className={`star ${
                    starIndex < level.stars ? "earned" : "unearned"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EngineeringPage;
