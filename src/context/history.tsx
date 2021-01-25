import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { HistoryContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const HistoryContext = createContext<HistoryContextType>({});
export const useHistoryContext = (): HistoryContextType => useContext(HistoryContext);

export const HistoryContextProvider: React.FC = ({ children }) => {
  const { asPath } = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory([...history, process.env.FRONTEND_URL + asPath]);
  }, [asPath]);

  return <HistoryContext.Provider value={{ history }}>{children}</HistoryContext.Provider>;
};
