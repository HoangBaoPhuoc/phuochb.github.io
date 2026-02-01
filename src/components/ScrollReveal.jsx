import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ 
  children, 
  direction = 'up', // 'up', 'left', 'right'
  sidebar = false, // if true, it's coming from the side
  className = ''   
}) {
  const getVariants = () => {
    // "Combined appear from bottom and both sides" - we can simulate this by variations
    switch (direction) {
      case 'left':
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 100 },
          visible: { opacity: 1, x: 0 }
        };
      case 'up':
      default:
        return {
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }} // Trigger when 15% visible
      transition={{ duration: 1.0, ease: "easeOut" }} // Slower transition
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
