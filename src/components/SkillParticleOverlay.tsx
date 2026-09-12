import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SkillParticleOverlayProps {
  element: string;
  color: string;
}

export const SkillParticleOverlay: React.FC<SkillParticleOverlayProps> = ({ element, color }) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate particles
    setParticles(Array.from({ length: 24 }).map((_, i) => i));
  }, []);

  const getEffectVariants = (index: number) => {
    const angle = (index / 24) * Math.PI * 2;
    const distance = 40 + Math.random() * 40; // Spread distance

    switch (element) {
      case 'water':
      case 'ice':
      case 'space': // Predator style absorption (implodes instead of explodes)
        return {
          initial: { 
            opacity: 0, 
            scale: 0, 
            x: Math.cos(angle) * distance * 1.5, 
            y: Math.sin(angle) * distance * 1.5 
          },
          animate: { 
            opacity: [0, 1, 0], 
            scale: [0.5, 1.5, 0], 
            x: 0, 
            y: 0 
          },
          transition: { duration: 0.8, ease: "easeIn", delay: Math.random() * 0.2 }
        };
      case 'fire':
      case 'lightning': // Explosion outwards
      case 'wind':
        return {
          initial: { 
            opacity: 1, 
            scale: 1, 
            x: 0, 
            y: 0 
          },
          animate: { 
            opacity: 0, 
            scale: 0, 
            x: Math.cos(angle) * distance, 
            y: Math.sin(angle) * distance 
          },
          transition: { duration: 0.6, ease: "easeOut" }
        };
      default: // Holy, dark, earth - upward burst
        return {
          initial: { 
            opacity: 1, 
            scale: 0, 
            x: (Math.random() - 0.5) * 30, 
            y: 20 
          },
          animate: { 
            opacity: 0, 
            scale: [0, 1.5, 0.5], 
            y: -50 - Math.random() * 50 
          },
          transition: { duration: 0.8, ease: "easeOut", delay: Math.random() * 0.1 }
        };
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
      {/* Skill Flash Background */}
      <motion.div
        initial={{ opacity: 0.8, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 rounded-full blur-md"
        style={{ backgroundColor: color }}
      />
      
      {/* Particles */}
      {particles.map((i) => {
        const variant = getEffectVariants(i);
        return (
          <motion.div
            key={i}
            initial={variant.initial}
            animate={variant.animate}
            transition={variant.transition as any}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 4 + 'px',
              height: Math.random() * 6 + 4 + 'px',
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
            }}
          />
        );
      })}
    </div>
  );
};
