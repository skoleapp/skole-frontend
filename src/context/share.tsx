import React, { createContext, useContext, useState } from 'react';
import { ShareContextType, ShareDialogParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ShareContext = createContext<ShareContextType>({});
export const useShareContext = (): ShareContextType => useContext(ShareContext);

const initialShareDialogParams: ShareDialogParams = {
  header: '',
  title: '',
  text: '',
  linkSuffix: '',
  customLink: '',
};

export const ShareContextProvider: React.FC = ({ children }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const [shareDialogParams, setShareDialogParams] = useState<ShareDialogParams>(
    initialShareDialogParams,
  );

  const handleOpenShareDialog = (newShareDialogParams: ShareDialogParams): void => {
    setShareDialogParams({ ...shareDialogParams, ...newShareDialogParams });
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = (): void => {
    setShareDialogParams(initialShareDialogParams);
    setShareDialogOpen(false);
  };

  const value = {
    shareDialogOpen,
    handleOpenShareDialog,
    handleCloseShareDialog,
    shareDialogParams,
  };

  return <ShareContext.Provider value={value}>{children}</ShareContext.Provider>;
};
