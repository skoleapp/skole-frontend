import { useTheme } from '@material-ui/core/styles';
// Ignore: This is the only place where we want to allow importing the `useMediaQuery`-hook.
import useMediaQuery from '@material-ui/core/useMediaQuery'; // eslint-disable-line no-restricted-imports
import React, { createContext, useContext } from 'react';
import { MediaQueryContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const MediaQueryContext = createContext<MediaQueryContextType>({});
export const useMediaQueryContext = (): MediaQueryContextType => useContext(MediaQueryContext);

export const MediaQueryContextProvider: React.FC = ({ children }) => {
  const { breakpoints } = useTheme();
  const smDown = useMediaQuery(breakpoints.down('sm'));

  const value = {
    smDown,
    mdUp: !smDown,
  };

  return <MediaQueryContext.Provider value={value}>{children}</MediaQueryContext.Provider>;
};
