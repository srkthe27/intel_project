import React, { useEffect, useState } from "react";
import "./Types.css"; // Ensure your CSS is up to date
import {
  FaRobot,
  FaCar,
  FaBiohazard,
  FaSolarPanel,
  FaShieldAlt,
  FaLeaf,
  FaFish,
  FaBuilding,
  FaWind,
  FaDatabase,
  FaRocket,
  FaMusic,
  FaCode,
} from "react-icons/fa";
import {
  GiChemicalDrop,
  GiNanoBot,
  GiOilPump,
  GiMicroscope,
} from "react-icons/gi";

// Define the branches of engineering with their titles and icons
const engineeringBranches = [
  { title: "Mechanical Engineering", icon: <GiChemicalDrop /> },
  { title: "Civil Engineering", icon: <FaBuilding /> },
  { title: "Electrical Engineering", icon: <FaWind /> },
  { title: "Aerospace Engineering", icon: <FaRocket /> },
  { title: "Sound Engineering", icon: <FaMusic /> },
  { title: "Biomedical Engineering", icon: <FaBiohazard /> },
  { title: "Robotics Engineering", icon: <FaRobot /> },
  { title: "Automotive Engineering", icon: <FaCar /> },
  { title: "Cybersecurity Engineering", icon: <FaShieldAlt /> },
  { title: "Environmental Engineering", icon: <FaLeaf /> },
  { title: "Nanotechnology Engineering", icon: <GiNanoBot /> },
  { title: "Software Engineering", icon: <FaCode /> },
  { title: "Biotechnology Engineering", icon: <GiMicroscope /> },
  { title: "Energy Engineering", icon: <FaSolarPanel /> },
  { title: "Agricultural Engineering", icon: <FaFish /> },
  { title: "Petroleum Engineering", icon: <GiOilPump /> },
  { title: "Structural Engineering", icon: <FaBuilding /> },
  { title: "Data Engineering", icon: <FaDatabase /> },
];

interface Question {
  question: string;
  choices: string[];
  correctAnswer: string;
}

const Types: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState<number>(2);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/generate-quiz/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stars }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch questions. Status code: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.questions)) {
          setQuestions(parseQuestions(data.questions));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Fetch error: ", err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [stars]);

  const parseQuestions = (rawQuestions: string[]): Question[] => {
    return rawQuestions.map((rawQuestion) => {
      const [question, ...choices] = rawQuestion.split('\n');
      const correctAnswer = choices.find(choice => choice.includes('(correct)')) || '';
      return {
        question: question.replace('Q: ', '').trim(),
        choices: choices.map(choice => choice.replace(/^\w: /, '').replace(' (correct)', '')),
        correctAnswer: correctAnswer.replace(/^\w: /, '').replace(' (correct)', ''),
      };
    });
  };

  const handleMouseEnter = (branch: string) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(`/sounds/${branch.toLowerCase()}.mp3`);
    newAudio.play().catch(() => {
      console.error(`Sound file for ${branch} not found.`);
    });
    setAudio(newAudio);
  };

  const handleStarChange = (newStars: number) => {
    setStars(newStars);
  };

  return (
    <div className="types-container">
      <h1 className="types-title">Explore Different Types of Engineering</h1>
      
      <div className="branches-grid">
        {engineeringBranches.map((branch, index) => (
          <div
            key={index}
            className="branch-card"
            onMouseEnter={() => handleMouseEnter(branch.title)}
          >
            <div className="icon-container">{branch.icon}</div>
            <p className="branch-title">{branch.title}</p>
          </div>
        ))}
      </div>

      <div className="star-selector">
        <p>Select Difficulty Level:</p>
        <button onClick={() => handleStarChange(1)} className={stars === 1 ? "active" : ""}>
          1 Star (Easy)
        </button>
        <button onClick={() => handleStarChange(2)} className={stars === 2 ? "active" : ""}>
          2 Stars (Medium)
        </button>
        <button onClick={() => handleStarChange(3)} className={stars === 3 ? "active" : ""}>
          3 Stars (Hard)
        </button>
      </div>

      {loading && <div className="loading-indicator">Loading questions...</div>}
      {error && <div className="error-message">Error: {error}</div>}
      {!loading && !error && questions.length > 0 && (
        <div className="questions-container">
          <h2>Answer These Questions:</h2>
          <ol>
            {questions.map((question, index) => (
              <li key={index}>
                <p>{question.question}</p>
                <ul>
                  {question.choices.map((choice, choiceIndex) => (
                    <li key={choiceIndex}>{choice}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Types;
