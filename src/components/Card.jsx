import React from 'react';

export const Card = ({ imageSrc, description, className }) => {
  return (
    <div className={` flex flex-col md:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Left side for Image */}
      <div className="w-full md:w-1/2">
        <img
          src={imageSrc}
          alt="Card Image"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right side for Title and Description */}
      <div className="w-full md:w-1/2 p-4 bg-gray-300 flex items-center justify-center">
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};
