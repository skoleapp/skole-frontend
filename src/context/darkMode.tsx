import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DarkModeContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DarkModeContext = createContext<DarkModeContextType>({});
export const useDarkModeContext = (): DarkModeContextType => useContext(DarkModeContext);

export const DarkModeContextProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
};
