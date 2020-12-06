import React, { createContext, useContext, useState } from 'react';
import { ShareContextType, ShareParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ShareContext = createContext<ShareContextType>({});
export const useShareContext = (): ShareContextType => useContext(ShareContext);

const initialShareParams = {
  shareTitle: '',
  shareText: '',
};

export const ShareContextProvider: React.FC = ({ children }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareParams, setShareParams] = useState<ShareParams>(initialShareParams);

  const handleOpenShareDialog = (shareParams: ShareParams) => {
    setShareParams(shareParams);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareParams(initialShareParams);
    setShareDialogOpen(false);
  };

  const value = {
    shareDialogOpen,
    handleOpenShareDialog,
    handleCloseShareDialog,
    shareParams,
  };

  return <ShareContext.Provider value={value}>{children}</ShareContext.Provider>;
};
