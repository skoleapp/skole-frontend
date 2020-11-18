import React, { createContext, useContext, useState } from 'react';
import { SettingsContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const SettingsContext = createContext<SettingsContextType>({});
export const useSettingsContext = (): SettingsContextType =>
  useContext(SettingsContext);

export const SettingsContextProvider: React.FC = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = (open: boolean): void => setSettingsOpen(open);

  const value = {
    settingsOpen,
    toggleSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
