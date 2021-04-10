import React, { createContext, useContext, useState } from 'react';
import { InviteContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const InviteContext = createContext<InviteContextType>({});
export const useInviteContext = (): InviteContextType => useContext(InviteContext);

export const InviteContextProvider: React.FC = ({ children }) => {
  const [generalInviteDialogOpen, setGeneralInviteDialogOpen] = useState(false);
  const handleOpenGeneralInviteDialog = (): void => setGeneralInviteDialogOpen(true);
  const handleCloseGeneralInviteDialog = (): void => setGeneralInviteDialogOpen(false);
  const [customInviteDialogOpen, setCustomInviteDialogOpen] = useState(false);
  const handleOpenCustomInviteDialog = (): void => setCustomInviteDialogOpen(true);
  const handleCloseCustomInviteDialog = (): void => setCustomInviteDialogOpen(false);

  const value = {
    generalInviteDialogOpen,
    handleOpenGeneralInviteDialog,
    handleCloseGeneralInviteDialog,
    customInviteDialogOpen,
    handleOpenCustomInviteDialog,
    handleCloseCustomInviteDialog,
  };

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
};
