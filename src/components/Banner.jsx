import React from 'react';

export const Banner = () => {
  return (
    <div className="bg-[#DBE2EF] text-black">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full h-auto sm:h-24">
        {/* Left Item */}
        <div className="text-lg sm:text-xl text-center sm:text-left mb-4 sm:mb-0 w-full sm:w-auto overflow-hidden ml-4 sm:ml-8">
          25+ Years
        </div>
        
        {/* Center Item */}
        <div className="text-lg sm:text-xl text-center mb-4 sm:mb-0 w-full sm:w-auto overflow-hidden">
          20 Projects
        </div>
        
        {/* Right Item */}
        <div className="text-lg sm:text-xl text-center w-full sm:w-auto overflow-hidden mr-4 sm:ml-8">
          Example
        </div>
      </div>
    </div>
  );
};
