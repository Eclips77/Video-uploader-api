import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-panel rounded-xl p-6 transition-all duration-300',
        hoverEffect && 'hover:bg-surfaceLight/60 hover:border-primary/30 hover:scale-[1.02] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
