import React from "react";

const SkeletonCard = () => {
  return (
    <div className="w-full h-[220px] bg-white p-4 border-6 border-white rounded-tl-2xl rounded-br-2xl animate-pulse flex flex-col">
      <div className="w-full h-2/3 p-2 mb-2 md:mb-4 bg-gray-200 rounded-lg"></div>
      <div className="w-full h-1/3 flex flex-col items-center justify-end space-y-2 mt-auto">
        <div className="w-2/3 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
