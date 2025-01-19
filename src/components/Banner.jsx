import React from 'react';

export const Banner = () => {
  return (
    <div className="bg-[#FAFFAF] text-black">
      <div className="flex justify-between items-center w-full h-auto sm:h-24">
        {/* Left Item */}
        <div className="text-lg sm:text-xl text-center w-auto overflow-hidden px-4">
          25+ Years
        </div>
        
        {/* Center Item */}
        <div className="text-lg sm:text-xl text-center w-auto overflow-hidden px-4">
          20 Projects
        </div>
        
        {/* Right Item */}
        <div className="text-lg sm:text-xl text-center w-auto overflow-hidden px-4">
          Example
        </div>
      </div>
    </div>
  );
};
