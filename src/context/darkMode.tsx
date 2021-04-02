import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DarkModeContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DarkModeContext = createContext<DarkModeContextType>({});
export const useDarkModeContext = (): DarkModeContextType => useContext(DarkModeContext);

export const DarkModeContextProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const dynamicPrimaryColor: 'primary' | 'secondary' = darkMode ? 'secondary' : 'primary';

  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
    localStorage.removeItem('dark-mode');
    localStorage.setItem('dark-mode', String(!darkMode));
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('dark-mode');
    let darkMode = prefersDarkMode;

    if (savedDarkMode === 'false') {
      darkMode = false;
    } else if (savedDarkMode === 'true') {
      darkMode = true;
    }

    setDarkMode(darkMode);
  }, [prefersDarkMode]);

  const value = {
    darkMode,
    toggleDarkMode,
    dynamicPrimaryColor,
  };

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};
