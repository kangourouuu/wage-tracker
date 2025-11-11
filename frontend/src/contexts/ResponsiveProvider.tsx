import React, { useState, useEffect, type ReactNode, useMemo } from 'react';
import { ResponsiveContext } from './ResponsiveContext'; // Import the context

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1200);
      setIsDesktop(width >= 1200);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    checkBreakpoints();
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    window.addEventListener('resize', checkBreakpoints);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
      window.removeEventListener('resize', checkBreakpoints);
    };
  }, []);

  const value = useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    prefersReducedMotion,
  }), [isMobile, isTablet, isDesktop, prefersReducedMotion]);

  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};
