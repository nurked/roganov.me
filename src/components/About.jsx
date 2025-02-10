// import React from "react";

export const About = () => {
  return (
    <div
      id="about"
      className=" bg-[#fafbfb] w-full h-auto md:h-screen flex flex-col md:flex-row"
    >
      {/* Left section (Image and Name) */}
      <div className="w-full md:mb-24 lg:mb-0 relative flex flex-col items-center justify-center ">
        <img
          src="./ivan.png"
          alt="Placeholder"
          className="w-2/3 h-2/3 mt-10 max-w-2/3 rounded-lg object-contain"
        />
        <div className="mt-4 text-center text-black">
          <p className="font-bold text-lg">Ivan Roganov</p>
          <p className="text-sm">Entrepreneur</p>
        </div>
      </div>

      {/* Right section (Content) */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-3/4 md:w-3/4 md:mt-16 lg:mt-0 max-w-3xl">
          <p className=" text-lg">
            With 25 years of experience in IT, I’ve been programming since 1999,
            honing my skills and expertise across multiple areas of technology.
          </p>
          <p className="mb-4 text-lg">
            Since 2004, I’ve gained hands-on programming experience. Over the
            years, I’ve developed a strong leading teams and managing projects,
            applying my knowledge to problem-solving approach, believing that
            every issue can be fixed.
          </p>
          <p className="mb-4 text-lg">
            I have successfully managed over 20 failing IT projects in the past
            15 years, turning them around and making them operational. I am
            confident in my ability to tackle any project, no matter how
            challenging.
          </p>

          <p className="mb-4 text-lg">
            There isn’t a program that can’t be fixed, and there isn’t an IT
            system that can’t be made operational.
          </p>
          <p className="lg:mb-10 md:mb-8 text-lg">
            In my career, I’ve learned that no program is beyond repair, and no
            IT system is beyond restoration. There’s always a way to fix it and
            make it better.
          </p>
        </div>
      </div>
    </div>
  );
};
