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
    // Ignore: `history` and `setHistory` must be omitted from the dependency array to avoid an infinite loop.
  }, [asPath]); // eslint-disable-line react-hooks/exhaustive-deps

  return <HistoryContext.Provider value={{ history }}>{children}</HistoryContext.Provider>;
};
