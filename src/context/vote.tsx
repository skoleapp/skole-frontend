import React, { createContext, useContext, useState } from 'react';
import { VoteContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const VoteContext = createContext<VoteContextType>({});

export const useVoteContext = (): VoteContextType => useContext(VoteContext);

export const VoteContextProvider: React.FC = ({ children }) => {
  const [votePromptOpen, setVotePromptOpen] = useState(false);
  const handleOpenVotePrompt = (): void => setVotePromptOpen(true);
  const handleCloseVotePrompt = (): void => setVotePromptOpen(false);

  const value = {
    votePromptOpen,
    handleOpenVotePrompt,
    handleCloseVotePrompt,
  };

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};
