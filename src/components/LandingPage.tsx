import React, { useRef } from "react";
import { Container } from "react-bootstrap";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  onJobClick: (job: string) => void;
}

const jobs = [
  { job: "Doctor", image: "/src/components/images/Doctor.png" },
  { job: "Engineer", image: "/src/components/images/Engineer.png" },
  { job: "Defense", image: "/src/components/images/Defense.png" },
  { job: "Scientist", image: "/src/components/images/Scientist.png" },
  { job: "Professor", image: "/src/components/images/Professor.png" },
  { job: "Lawyer", image: "/src/components/images/Lawyer.png" },
  { job: "Painter", image: "/src/components/images/Painter.png" },
  { job: "Chef", image: "/src/components/images/Chef.png" },
  { job: "Music Director", image: "/src/components/images/music director.png" },
  { job: "Athlete", image: "/src/components/images/athlete.png" },
  { job: "Cinematographer", image: "/src/components/images/cinematographer.png" },
  { job: "Photographer", image: "/src/components/images/photographer.png" }];

const LandingPage: React.FC<LandingPageProps> = ({ onJobClick }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (bubbleRef.current) {
      const bubblePosition = bubbleRef.current.getBoundingClientRect().top + window.scrollY;
  
      // Scroll to the bubble position slightly above it
      window.scrollTo({
        top: bubblePosition - 40, // Adjust -50 to the desired offset above the bubble
        behavior: "smooth"
      });
    }
  };
  
  

  const handleChatbotClick = () => {
    navigate("/chatbot");
  };

  return (
    <Container className="landing-page">
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      {/* Interactive Introduction Section */}
      <div className="intro-section">
        <h2>✨ Welcome to Your Amazing Career Adventure! 🌍</h2>
        <p>
          Hey there, <span className="highlight">young explorers</span>! 🕵️‍♂️🕵️‍♀️
          Ready to dive into the world of{" "}
          <span className="highlight">exciting careers</span>? Whether you want
          to be a <span className="highlight">heroic doctor</span>, an{" "}
          <span className="highlight">awesome engineer</span>, a{" "}
          <span className="highlight">brave soldier</span>, a{" "}
          <span className="highlight">super scientist</span>, a{" "}
          <span className="highlight">knowledgeable professor</span>, or a{" "}
          <span className="highlight">sharp lawyer</span> – there’s so much to
          discover here!
        </p>
        <p>
          Sometimes, thinking about your future can be a bit like a puzzle 🧩,
          right? But don’t worry, we’re here to help you put all the pieces
          together! Explore different career paths, learn what makes each one
          unique, and find out what it takes to follow your dreams! 🌠
        </p>
        <button className="start-button" onClick={handleStartClick}>
          Click Here to Start Your Journey! 🌈
        </button>
      </div>

      {/* Career Bubbles Section (acts as banner) */}
      <div className="bubble-banner-section" ref={bubbleRef}>
        <h2>Explore Exciting Careers!</h2>
        <p>Select a career below to start learning more!</p>
        <div className="bubble-container">
          {jobs.map((job, index) => (
            <div key={index} className="bubble" onClick={() => onJobClick(job.job)}>
              <img src={job.image} alt={job.job} className="bubble-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Chatbot Button Section */}
      <div className="chatbot-button-container">
        <button className="chatbot-button" onClick={handleChatbotClick}>
          💬 Ask Our Chatbot! 🤖
        </button>
      </div>
    </Container>
  );
};

export default LandingPage;
