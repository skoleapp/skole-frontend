import React, { createContext, useContext, useState } from 'react';
import { InfoContextType, InfoDialogParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const InfoContext = createContext<InfoContextType>({});

export const useInfoContext = (): InfoContextType => useContext(InfoContext);

const initialInfoDialogParams: InfoDialogParams = {
  header: '',
  emoji: '',
  creator: null,
  created: '',
  infoItems: [],
};

export const InfoContextProvider: React.FC = ({ children }) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogParams, setInfoDialogParams] = useState(initialInfoDialogParams);

  const handleOpenInfoDialog = (newInfoDialogParams: InfoDialogParams) => {
    setInfoDialogParams({ ...infoDialogParams, ...newInfoDialogParams });
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogParams(initialInfoDialogParams);
    setInfoDialogOpen(false);
  };

  const value = {
    infoDialogOpen,
    handleOpenInfoDialog,
    handleCloseInfoDialog,
    infoDialogParams,
  };

  return <InfoContext.Provider value={value}>{children}</InfoContext.Provider>;
};
