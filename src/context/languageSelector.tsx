import React, { createContext, useContext, useState } from 'react';
import { LanguageSelectorContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const LanguageSelectorContext = createContext<LanguageSelectorContextType>({});

export const useLanguageSelectorContext = (): LanguageSelectorContextType =>
  useContext(LanguageSelectorContext);

export const LanguageSelectorContextProvider: React.FC = ({ children }) => {
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);

  const value = {
    languageSelectorOpen,
    toggleLanguageSelector,
  };

  return (
    <LanguageSelectorContext.Provider value={value}>{children}</LanguageSelectorContext.Provider>
  );
};
