import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/Hero.jpeg';

export const Hero = () => {
  const [animationStart, setAnimationStart] = useState(false);

  useEffect(() => {
    setAnimationStart(true);
  }, []);

  const topText = "Ivan Roganov";
  const bottomText = "I’m here to help you.";
  const bottomTextForButton = "Let’s get to know each other";

  // Function to scroll to the About section
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <motion.div
      className="w-full h-[calc(100vh_-_74px)] flex flex-col border border-black bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Top Section */}
      <motion.div
        className="section top-section flex-1 flex justify-start items-end px-4 sm:px-8 md:px-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: animationStart ? 1 : 0,
          y: animationStart ? 0 : -50,
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },
          y: {
            duration: 0.8,
            ease: "easeOut",
          },
        }}
      >
        <div className="text text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-left mb-0">
          {topText.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: animationStart ? 1 : 0,
                y: animationStart ? 0 : -50
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                },
                y: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }
              }}
              className={`inline-block ${char === " " ? "mr-4" : "mr-1"} text-gray-100`}
              style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)' }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="section bottom-section flex-1 flex justify-center sm:justify-end items-start px-4 sm:px-8 md:px-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: animationStart ? 1 : 0,
          y: animationStart ? 0 : 50
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },
          y: {
            duration: 0.8,
            ease: "easeOut",
          },
        }}
      >
        <div className="text text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-right mt-0">
          {bottomText.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: animationStart ? 1 : 0,
                y: animationStart ? 0 : 50
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                },
                y: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }
              }}
              className={`inline-block ${char === " " ? "mr-4" : "mr-1"} text-gray-100`}
              style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)' }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Additional Bottom Section with Text and Button */}
      <motion.div
        className="section flex flex-col items-center pb-8 px-4 sm:px-8 md:px-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{
          opacity: animationStart ? 1 : 0,
          y: animationStart ? 0 : -50
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        {/* Text Above Button */}
        <motion.div
          className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -50 }} 
          animate={{
            opacity: animationStart ? 1 : 0,
            y: animationStart ? 0 : -50 
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0 
          }}
        >
          {bottomTextForButton.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: animationStart ? 1 : 0,
                y: animationStart ? 0 : -50
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                },
                y: {
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }
              }}
              className={`inline-block ${char === " " ? "mr-4" : "mr-1"} text-gray-100`}
              style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Button */}
        <motion.button
          className="bg-transparent text-white font-bold w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#504099] transition-all text-3xl border-2 border-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationStart ? 1 : 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0 
          }}
          onClick={handleScrollToAbout} // Add the click handler
        >
          ↓
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
