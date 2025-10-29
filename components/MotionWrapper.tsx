"use client";

import { motion } from 'framer-motion';
import { useTheme } from '../lib/theme-context';

interface MotionWrapperProps {
  children: React.ReactNode;
}

export default function MotionWrapper({ children }: MotionWrapperProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {children}
    </motion.div>
  );
}

