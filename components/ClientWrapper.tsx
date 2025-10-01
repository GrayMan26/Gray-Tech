"use client";

import { ThemeProvider } from '../lib/theme-context';
import MotionWrapper from './MotionWrapper';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ThemeProvider>
      <MotionWrapper>
        {children}
      </MotionWrapper>
    </ThemeProvider>
  );
}
