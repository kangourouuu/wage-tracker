import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';

export function useDarkMode() {
  const { isDark, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return { isDark, setIsDark: setTheme, toggle: toggleTheme };
}
