import React from 'react';

export const Card = () => {
  return (
    <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Left side for Image */}
      <div className="w-full md:w-1/2">
        <img
          src="https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Card Image"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right side for Title and Description */}
      <div className="w-full md:w-1/2 p-4">
        <p className="text-gray-700">
          This is the description of the card. It provides additional information about the content of the card.
          This is the description of the card. It provides additional information about the content of the card.
          This is the description of the card. It provides additional information about the content of the card.
          This is the description of the card. It provides additional information about the content of the card.
        </p>
      </div>
    </div>
  );
};
