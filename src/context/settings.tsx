import { useOpen } from 'hooks';
import React, { createContext, useContext } from 'react';
import { SettingsContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const SettingsContext = createContext<SettingsContextType>({});

export const useSettingsContext = (): SettingsContextType => useContext(SettingsContext);

export const SettingsContextProvider: React.FC = ({ children }) => {
  const {
    open: settingsDialogOpen,
    handleOpen: handleOpenSettingsDialog,
    handleClose: handleCloseSettingsDialog,
  } = useOpen();

  const value = {
    settingsDialogOpen,
    handleOpenSettingsDialog,
    handleCloseSettingsDialog,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
