import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonMotionProps = Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">;

interface ButtonProps extends ButtonMotionProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/25',
    secondary: 'bg-surfaceLight hover:bg-surfaceLight/80 text-white border border-white/10',
    ghost: 'hover:bg-white/5 text-textMuted hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
