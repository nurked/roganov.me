import React from 'react';
import { motion } from 'framer-motion';

const items = [
  '25+ Years',
  '20 Projects',
  'Example'
];

export const Banner = () => {
  return (
    <div className="bg-[rgb(97,0,175)] text-white overflow-hidden">
      <div className="flex items-center justify-between w-full h-auto sm:h-24 px-4">
        {/* Left Item */}
        <motion.div
          className="text-lg sm:text-xl text-center w-auto flex-shrink-0"
          animate={{
            x: ['100%', '-100%'], 
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            yoyo: Infinity, 
          }}
        >
          {items[0]}
        </motion.div>

        {/* Center Item */}
        <motion.div
          className="text-lg sm:text-xl text-center w-auto flex-shrink-0"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            yoyo: Infinity, 
          }}
        >
          {items[1]}
        </motion.div>

        {/* Right Item */}
        <motion.div
          className="text-lg sm:text-xl text-center w-auto flex-shrink-0"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            yoyo: Infinity, // This causes the animation to reverse and go back to the right
          }}
        >
          {items[2]}
        </motion.div>
      </div>
    </div>
  );
};
