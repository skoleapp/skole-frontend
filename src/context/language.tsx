import React, { createContext, useContext, useState } from 'react';
import { LanguageContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const LanguageContext = createContext<LanguageContextType>({});
export const useLanguageContext = (): LanguageContextType => useContext(LanguageContext);

export const LanguageContextProvider: React.FC = ({ children }) => {
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);
  const handleOpenLanguageMenu = (): void => toggleLanguageSelector(true);
  const handleCloseLanguageMenu = (): void => toggleLanguageSelector(false);

  const value = {
    languageSelectorOpen,
    handleOpenLanguageMenu,
    handleCloseLanguageMenu,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
