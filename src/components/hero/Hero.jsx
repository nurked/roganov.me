import React from "react";
import heroImage from "../../assets/Hero.jpeg";

export const Hero = () => {
  const handleScrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh_-_74px)]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-blue-900/50" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-16 space-y-6">
        {/* Text Container */}
        <div className="flex flex-col items-center space-y-4 text-center max-w-3xl">
          <h1 className="text-[28px] md:text-[40px] text-white font-lexend-heading font-normal">
            Hi there!
          </h1>

          <h2 className="text-[24px] md:text-[32px] text-white font-lexend-subheading font-normal">
            My name is Ivan and I&apos;m here to help you
          </h2>

          <p className="text-[20px] md:text-[24px] text-white font-lexend-text font-normal">
            Let&apos;s get to know each other
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleScrollToAbout}
          className="bg-transparent text-white w-12 h-12 md:w-14 md:h-14 rounded-full
                   flex items-center justify-center hover:bg-[#504099]
                   transition-all text-2xl md:text-3xl border-2 border-white mt-8"
          aria-label="Scroll to About section"
        >
          ↓
        </button>
      </div>
    </div>
  );
};
