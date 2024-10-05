// src/App.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { QuizProvider } from "./components/QuizContext";
import { ExperienceProvider } from "./components/ExperienceContext";
import LoadingScreen from "./components/LoadingScreen";
import SignInSignUp from "./components/SignInSignUp";
import CustomNavbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import EngineeringPage from "./components/EngineeringPage";
import WhatsEngineering from "./components/WhatsEngineering";
import Types from "./components/Types";
import Experts from "./components/Experts";
import AvatarSelection from "./components/AvatarSelection"; // Import AvatarSelection
import AudioPlayer from "./components/AuidoPlayer"; // Import AudioPlayer componen
import MedicalFieldPage from "./components/MedicalFieldPage";
import ChatbotPage from "./components/ChatbotPage"; // Import the Chatbot page
const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Store selected avatar
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  const handleAuthenticate = () => setIsAuthenticated(true);
  const handleForgotPassword = () => setIsAuthenticated(false);

  const handleJobClick = (job: string) => {
    console.log(`Job clicked: ${job}`);
    navigate(`/${job.toLowerCase()}`);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    navigate("/"); // Navigate back to the main page after selecting avatar
  };

  return (
    <ExperienceProvider>
      <QuizProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : isAuthenticated ? (
          <>
            <CustomNavbar selectedAvatar={selectedAvatar} />
            <AudioPlayer />
            <Routes>
              <Route
                path="/"
                element={<LandingPage onJobClick={handleJobClick} />}
              />
              <Route path="/doctor" element={<MedicalFieldPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />{" "}
              
              {/* New route */}
              <Route path="/engineer" element={<EngineeringPage />} />
              <Route path="/experts" element={<Experts />} />
              <Route
                path="/engineer/what'sengineering!"
                element={<WhatsEngineering />}
              />
              <Route path="/engineer/types" element={<Types />} />
              <Route
                path="/avatar-selection"
                element={
                  <AvatarSelection onSelectAvatar={handleAvatarSelect} />
                }
              />
            </Routes>
          </>
        ) : (
          <SignInSignUp
            onAuthenticate={handleAuthenticate}
            onForgotPassword={handleForgotPassword}
          />
        )}
      </QuizProvider>
    </ExperienceProvider>
  );
};

export default App;
