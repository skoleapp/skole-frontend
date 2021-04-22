import React, { createContext, useContext, useState } from 'react';
import { ScrollingContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ScrollingContext = createContext<ScrollingContextType>({});
export const useScrollingContext = (): ScrollingContextType => useContext(ScrollingContext);

export const ScrollingContextProvider: React.FC = ({ children }) => {
  const [scrollingDisabled, setScrollingDisabled] = useState(false);
  const enableScrolling = (): void => setScrollingDisabled(false);
  const disableScrolling = (): void => setScrollingDisabled(true);

  const value = {
    scrollingDisabled,
    enableScrolling,
    disableScrolling,
  };

  return <ScrollingContext.Provider value={value}>{children}</ScrollingContext.Provider>;
};
