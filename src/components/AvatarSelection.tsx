// src/components/AvatarSelection.tsx
import React, { useState } from "react";
import "./AvatarSelection.css";

const avatars = [
  {
    name: "Engineer Hero",
    src: "/src/components/images/avatars/engineerhero.avif",
  },
  { name: "Peter Parker Photographer", src: "src/components/images/avatars/andrew.jpg" },
  { name: "AR Rahman", src: "src/components/images/avatars/AR-Rahman.jpg" },
  { name: "Painter", src: "src/components/images/avatars/artist.jpeg" },
  { name: "Doctor", src: "src/components/images/avatars/doctor.jpeg" },
  { name: "Athlete", src: "src/components/images/avatars/athlete.jpg" },
  { name: "Usain Bolt", src: "src/components/images/avatars/bolt.jpg" },
  { name: "Cinematographer", src: "src/components/images/avatars/cinematography.jpg" },
  { name: "Girl Engineer", src: "src/components/images/avatars/engineer.jpeg" },
  { name: "Soldier Girl", src: "src/components/images/avatars/soldier grl.jpg" },

];

interface AvatarSelectionProps {
  onSelectAvatar: (avatar: string) => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  onSelectAvatar,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleAvatarClick = (avatar: string) => {
    setSelectedAvatar(avatar);
    onSelectAvatar(avatar); // Pass the selected avatar back to the parent component
  };

  return (
    <div className="avatar-box">
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      <pre></pre>
      {/* Move the heading inside the box */}
      <h2 className="avatar-box-heading">Select Your Avatar</h2>{" "}
      {/* Heading inside the box */}
      <div className="avatar-options-container">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-option-container ${
              selectedAvatar === avatar.src ? "selected" : ""
            }`}
            onClick={() => handleAvatarClick(avatar.src)}
          >
            <img src={avatar.src} alt={avatar.name} className="avatar-option" />
            <p className="avatar-name">{avatar.name}</p> {/* Avatar name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelection;
