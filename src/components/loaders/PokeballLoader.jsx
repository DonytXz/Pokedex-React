import React from "react";

const PokeballLoader = ({
  text = "Loading Pokémon...",
  size = "md",
  className = "",
}) => {
  const isSmall = size === "sm";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full h-full flex flex-col items-center justify-center ${
        isSmall ? "min-h-[120px] py-4" : "min-h-[200px]"
      } ${className}`}
    >
      <svg
        className={`${isSmall ? "w-10 h-10" : "w-16 h-16"} animate-spin opacity-90`}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Bottom half */}
        <path d="M 4,50 A 46,46 0 0,0 96,50 Z" fill="#f2f2f2" />
        {/* Top half */}
        <path d="M 4,50 A 46,46 0 0,1 96,50 Z" fill="#fb6c6c" />
        {/* Outer border */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="#1a1a1a" strokeWidth="8" />
        {/* Center horizontal line */}
        <line x1="4" y1="50" x2="96" y2="50" stroke="#1a1a1a" strokeWidth="8" />
        {/* Center outer circle */}
        <circle cx="50" cy="50" r="16" fill="#b3b3b3" stroke="#1a1a1a" strokeWidth="8" />
        {/* Center inner circle */}
        <circle cx="50" cy="50" r="6" fill="#ffffff" stroke="#1a1a1a" strokeWidth="4" />
      </svg>
      {text && (
        <p
          className={`${
            isSmall ? "mt-2.5 text-sm font-semibold text-gray-600" : "mt-4 text-xl font-bold text-gray-700"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default PokeballLoader;
