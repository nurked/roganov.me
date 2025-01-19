import React from 'react';
import { Card } from './Card';  

export const Superhero = () => {
  const image = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const description = "This is a superhero description. It provides additional information about the superhero.";

  const image2 = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const description2 = "This is a superhero description. It provides additional information about the superhero.";

  const image3 = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const description3 = "This is a superhero description. It provides additional information about the superhero.";

  const image4 = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const description4 = "This is a superhero description. It provides additional information about the superhero.";

  const image5  = "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const description5 = "This is a superhero description. It provides additional information about the superhero.";

  return (
    <div id='superhero' className="min-h-screen bg-[#3FA2F6] text-white flex flex-col">
      {/* Top Section with two cards, gap between them, covering entire width */}
      <div className="flex-1 flex flex-wrap justify-between items-center p-4 sm:p-2 md:p-8">
        <div className="flex w-full gap-4">
          <Card imageSrc={image} description={description} className="w-full sm:w-1/2 h-auto sm:h-[300px] lg:h-[500px] overflow-hidden" />
          <Card imageSrc={image2} description={description2} className="w-full sm:w-1/2 h-auto sm:h-[300px] lg:h-[500px] overflow-hidden" />
        </div>
      </div>
      
      {/* Middle Section with one card that covers the whole section */}
      <div className="p-4 sm:p-6 md:p-8 flex-1 flex justify-center items-center bg-[#3F72AF]">
        <Card imageSrc={image3} description={description3} className="w-full h-auto sm:h-[300px] lg:h-[500px] max-h-full overflow-auto" />
      </div>
      
      {/* Bottom Section */}
      <div className="flex-1 flex flex-wrap justify-between items-center p-4 sm:p-2 md:p-8">
        <div className="flex w-full gap-4">
          <Card imageSrc={image4} description={description4} className="w-full sm:w-1/2 h-auto sm:h-[300px] lg:h-[500px] overflow-hidden" />
          <Card imageSrc={image5} description={description5} className="w-full sm:w-1/2 h-auto sm:h-[300px] lg:h-[500px] overflow-hidden" />
        </div>
      </div>
    </div>
  );
};
