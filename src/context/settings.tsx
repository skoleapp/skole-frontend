import React, { createContext, useContext, useState } from 'react';
import { SettingsContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const SettingsContext = createContext<SettingsContextType>({});

export const useSettingsContext = (): SettingsContextType => useContext(SettingsContext);

export const SettingsContextProvider: React.FC = ({ children }) => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const handleOpenSettingsDialog = (): void => setSettingsDialogOpen(true);
  const handleCloseSettingsDialog = (): void => setSettingsDialogOpen(false);

  const value = {
    settingsDialogOpen,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
