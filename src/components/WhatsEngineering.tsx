import React, { useState, useEffect, useRef } from "react";
import "./WhatsEngineering.css"; // Import the CSS for styling
import { useExperience } from "./ExperienceContext";
import { useNavigate } from "react-router-dom"; // Import navigate

const WhatsEngineering: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const { addExperience } = useExperience(); // Use the addExperience function from context
  const navigate = useNavigate(); // Add navigate hook
  const [generatedContent, setGeneratedContent] = useState(""); // State to hold AI-generated content
  const audioRef = useRef<HTMLAudioElement>(null); // Reference to the audio element

  // Automatically play background music when the component renders
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const age = 10; // Example: age can be fetched dynamically or set manually for now

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/generate-content/', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ age }), // Send the age in the request body
        });

        const data = await response.json();
        setGeneratedContent(data.content); // Set the AI-generated content
      } catch (error) {
        console.error("Error fetching AI-generated content:", error);
      }
    };

    fetchContent();
  }, [age]);

  // Questions and answers for the quiz
  const questions = [
    {
      question: "What is engineering?",
      answers: [
        "A form of art",
        "Designing and building things",
        "Playing with toys",
        "None of the above",
      ],
      correct: 1,
    },
    {
      question: "Which field is part of engineering?",
      answers: ["Cooking", "Gardening", "Civil", "Singing"],
      correct: 2,
    },
    {
      question: "What do engineers build?",
      answers: [
        "Buildings and machines",
        "Stories and poems",
        "Paintings",
        "Songs and dances",
      ],
      correct: 0,
    },
    {
      question: "Which of these is an example of an engineer?",
      answers: ["A chef", "A software developer", "A musician", "A dancer"],
      correct: 1,
    },
    {
      question: "Why is engineering important?",
      answers: [
        "To make life easier",
        "To make art",
        "To play games",
        "To grow plants",
      ],
      correct: 0,
    },
  ];

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index.toString());
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct.toString()) {
      setScore(score + 1);
      addExperience(10); // Add experience points
    }

    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleFinishQuiz = async () => {
    let starsEarned = 0;
    if (score >= 2 && score < 4) {
      starsEarned = 1;
    } else if (score >= 4 && score < 5) {
      starsEarned = 2;
    } else if (score === 5) {
      starsEarned = 3;
    }

    try {
      // Submit the quiz score to the backend
      const response = await fetch('http://127.0.0.1:8000/api/submit-quiz/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          starsEarned,  // Include starsEarned in the request
          total_questions: questions.length,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Quiz submitted, XP earned:", data.XP);

        // Navigate with star count and XP earned
        navigate("/engineer", { state: { stars: starsEarned, xpEarned: data.XP } });
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="body">
      <div className="whats-engineering-container">
        {!quizStarted ? (
          <>
            <div className="content-box">
              <h1>What is Engineering?</h1>
              <div className="interactive-content">
                <h2>Discover the World of Engineering</h2>
                <p>{generatedContent}</p>

                {/* Interactive Animations */}
                <div className="animation-container">
                  <div className="engineer-animation">
                    <img
                      src="/src/components/images/engineering-animation.gif"
                      alt="Engineer animation"
                      className="animated-gif"
                    />
                  </div>
                </div>

                {/* Interactive Questions to Engage the Child */}
                <button className="interactive-button" onClick={startQuiz}>
                  Start Quiz!
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {!completed ? (
              <div className="quiz-container">
                <h2>Quiz: Test Your Knowledge!</h2>
                <p className="ques">{questions[currentQuestion].question}</p>
                {questions[currentQuestion].answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${
                      selectedAnswer === index.toString() ? "selected" : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {answer}
                  </button>
                ))}
                <button
                  className="next-button"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="quiz-result">
                <h2>Congratulations!</h2>
                <p>
                  You scored {score} out of {questions.length}!
                </p>
                <p>
                  You earned {score === questions.length ? 50 : score * 10} XP!
                </p>
                <p className="star">
                  {Array(
                    score >= 2 ? Math.min(3, Math.ceil(score / 2)) : 0
                  ).fill("⭐")}
                </p>
                <button onClick={handleFinishQuiz}>Finish and Return</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Background music */}
      <audio ref={audioRef} loop>
        <source src="/src/components/sound/background-music.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default WhatsEngineering;
