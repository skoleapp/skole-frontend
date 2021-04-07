import React, { createContext, useContext, useState } from 'react';
import { InviteContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const InviteContext = createContext<InviteContextType>({});
export const useInviteContext = (): InviteContextType => useContext(InviteContext);

export const InviteContextProvider: React.FC = ({ children }) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const handleOpenInviteDialog = (): void => setInviteDialogOpen(true);
  const handleCloseInviteDialog = (): void => setInviteDialogOpen(false);

  const value = {
    inviteDialogOpen,
    handleOpenInviteDialog,
    handleCloseInviteDialog,
  };

  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>;
};
