import React from 'react';
import { Card } from './Card';  // Assuming the Card component is in the same directory

export const Superhero = () => {
  return (
    <div className="min-h-screen bg-[#3F72AF] text-white flex flex-col">
      {/* Top Section with two cards */}
      <div className="flex-1 flex justify-center items-center bg-[#3F72AF]">
        <div className="flex flex-col md:flex-row w-full max-w-screen-lg space-y-4 md:space-y-0 md:space-x-16 p-4">
          <Card className="h-full max-h-full overflow-auto" />
          <Card className="h-full max-h-full overflow-auto" />
        </div>
      </div>
      
      {/* Middle Section with one card that covers the whole section */}
      <div className="flex-1 flex justify-center items-center bg-[#3F72AF]">
        <Card className="h-full w-full max-h-full overflow-auto" />
      </div>
      
      {/* Bottom Section */}
      <div className="flex-1 flex justify-center items-center bg-[#3F72AF]">
        <div className="flex flex-col md:flex-row w-full max-w-screen-lg space-y-4 md:space-y-0 md:space-x-16 p-4">
          <Card className="h-full max-h-full overflow-auto" />
          <Card className="h-full max-h-full overflow-auto" />
        </div>
      </div>
    </div>
  );
};
