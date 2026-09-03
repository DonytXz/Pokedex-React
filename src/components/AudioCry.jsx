import React, { useState, useRef, useEffect } from "react";

const AudioCry = ({ cryUrl, pokemonName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [cryUrl]);

  if (!cryUrl) return null;

  const togglePlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    try {
      const audio = new Audio(cryUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={
        isPlaying
          ? `Stop cry for ${pokemonName || "Pokémon"}`
          : `Play cry for ${pokemonName || "Pokémon"}`
      }
      title={`Play ${pokemonName || "Pokémon"} cry`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
        isPlaying
          ? "bg-green-600 text-white border-green-600 shadow-sm animate-pulse"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span aria-hidden="true" className="text-sm">
        {isPlaying ? "⏹️" : "🔊"}
      </span>
      <span>{isPlaying ? "Playing Cry..." : "Cry"}</span>
    </button>
  );
};

export default AudioCry;
