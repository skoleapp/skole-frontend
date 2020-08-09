import React, { Context, createContext, useContext, useState } from 'react';
import { LanguageSelectorContextType } from 'types';

const LanguageSelectorContext = createContext<LanguageSelectorContextType | null>(null);

export const useLanguageSelectorContext = (): LanguageSelectorContextType =>
    useContext(LanguageSelectorContext as Context<LanguageSelectorContextType>);

export const LanguageSelectorContextProvider: React.FC = ({ children }) => {
    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);

    const value = {
        languageSelectorOpen,
        toggleLanguageSelector,
    };

    return <LanguageSelectorContext.Provider value={value}>{children}</LanguageSelectorContext.Provider>;
};
