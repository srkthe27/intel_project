import React, { useState } from "react";
import "./ChatbotPage.css";

type ChatMessage = {
  sender: "user" | "bot"; // Explicit type for sender
  message: string;
};

const ChatbotPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [careerName, setCareerName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: "bot", message: "Hi there! Ask me anything!!" } // Bot's greeting message
  ]);
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading status

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt || !careerName || !age) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: "Please provide a question, career name, and your age." },
      ]);
      return;
    }

    const newHistory: ChatMessage[] = [...chatHistory, { sender: "user", message: prompt }];
    setChatHistory(newHistory);
    setPrompt(""); // Clear input after submission
    setCareerName(""); // Clear career input after submission
    setAge(""); // Clear age input after submission
    setLoading(true); // Start loading state

    try {
      const csrfToken = getCSRFToken();
      console.log("Sending request with:", { prompt, careerName, age });

      const res = await fetch("http://127.0.0.1:8000/api/career-guidance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ prompt, career_name: careerName, age }),
      });

      console.log("Response status:", res.status);

      if (res.status === 403) {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", message: "Access forbidden. You might be trying to access restricted information." },
        ]);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error response data:", errorData); // Log error data for debugging
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", message: `Error: ${errorData.error || "Failed to fetch guidance."}` },
        ]);
        return;
      }

      const data = await res.json();
      console.log("Response data:", data); // Log the response data

      setChatHistory((prev) => [...prev, { sender: "bot", message: data.generated_career_response }]);
      setChatHistory((prev) => [...prev, { sender: "bot", message: data.model_response }]);
    } catch (error) {
      console.error("Error occurred:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}` },
      ]);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chat-window">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            <div className={`avatar ${chat.sender}-avatar`}></div>
            <div className="message-content">{chat.message}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="avatar bot-avatar"></div>
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Career (e.g., doctor)"
          value={careerName}
          onChange={(e) => setCareerName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          min={6}
          max={17}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatbotPage;
