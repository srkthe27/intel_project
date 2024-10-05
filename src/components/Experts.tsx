import React from "react";
import "./Experts.css";

const Experts: React.FC = () => {
  const expertData = [
    {
      name: "Mechanical Engineering Expert",
      videoUrl: "https://www.youtube.com/embed/DZ_UvMhTIv0", // Correct YouTube embed URL
      branch: "Mechanical Engineering",
    },
    {
      name: "Civil Engineering Expert",
      videoUrl: "https://www.youtube.com/embed/E0We5mC5VKo", // Correct YouTube embed URL
      branch: "Civil Engineering",
    },
    // Add more experts here
  ];

  return (
    <div className="experts-container">
      <h1>Meet the Experts</h1>
      <div className="expert-grid">
        {expertData.map((expert, index) => (
          <div key={index} className="expert-card">
            <div className="expert-video-wrapper">
              <iframe
                width="100%"
                height="200"
                src={expert.videoUrl} // Corrected YouTube URL
                title={expert.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="expert-info">
              <h2>{expert.name}</h2>
              <p>{expert.branch}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experts;
