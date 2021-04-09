import { useMediaQueries } from 'hooks';
import { useRouter } from 'next/router';
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
  const { smDown } = useMediaQueries();
  const { asPath } = useRouter();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const [shareDialogParams, setShareDialogParams] = useState<ShareDialogParams>(
    initialShareDialogParams,
  );

  const handleOpenShareDialog = async (newShareDialogParams: ShareDialogParams): Promise<void> => {
    if (smDown) {
      const { navigator } = window;
      const { title, text, linkSuffix } = newShareDialogParams;

      if (navigator?.share) {
        try {
          await navigator.share({
            title,
            text,
            url: `${process.env.FRONTEND_URL}${asPath}${linkSuffix}`,
          });
        } catch {
          // User cancelled.
        }
      }
    } else {
      setShareDialogParams({ ...shareDialogParams, ...newShareDialogParams });
      setShareDialogOpen(true);
    }
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
