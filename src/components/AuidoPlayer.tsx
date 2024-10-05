// src/components/AudioPlayer.tsx
import React, { useRef, useEffect } from "react";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Automatically play background music when the app loads
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1; // Adjust the volume level
      audioRef.current.play();
    }
  }, []);

  return <audio ref={audioRef} src="/src/components/audio/bgmusic.mp3" loop />;
};

export default AudioPlayer;
