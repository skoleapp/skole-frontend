import React, { createContext, useContext, useState } from 'react';
import { ThreadFormContextType, ThreadFormParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ThreadFormContext = createContext<ThreadFormContextType>({});

export const useThreadFormContext = (): ThreadFormContextType => useContext(ThreadFormContext);

export const ThreadFormContextProvider: React.FC = ({ children }) => {
  const [threadFormOpen, setThreadFormOpen] = useState(false);
  const [threadFormParams, setThreadFormParams] = useState<ThreadFormParams>({ title: '' });

  const handleOpenThreadForm = (params?: ThreadFormParams): void => {
    setThreadFormOpen(true);

    if (params) {
      setThreadFormParams(params);
    }
  };

  const handleCloseThreadForm = (): void => setThreadFormOpen(false);

  const value = {
    threadFormOpen,
    handleOpenThreadForm,
    handleCloseThreadForm,
    threadFormParams,
  };

  return <ThreadFormContext.Provider value={value}>{children}</ThreadFormContext.Provider>;
};
