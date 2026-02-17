import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const ANIMATION_DURATION = 40;

export default function Banner({
  items = [
    "25+ years of experience",
    "20 Projects",
    "6 teams",
    "Over $1M saved in production costs",
    "100+ articles",
    "3 companies founded",
    "6 years of education experience",
    "10000+ hours of volunteer work",
  ],
  fontSize = "text-lg sm:text-xl",
}) {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [items]);

  return (
    <div className="bg-surface-card border-y border-white/10 overflow-hidden relative">
      <div className="flex whitespace-nowrap">
        {[...Array(2)].map((_, arrayIndex) => (
          <motion.div
            key={arrayIndex}
            ref={contentRef}
            className="flex gap-[4rem]"
            initial={{ x: 0 }}
            animate={{ x: -contentWidth }}
            transition={{
              duration: ANIMATION_DURATION,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className={`${fontSize} px-4 py-6 flex-shrink-0 font-semibold`}
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
