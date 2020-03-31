import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { toggleLanguageSelector } from '../actions';
import { useTranslation } from '../i18n';

interface Language {
    code: string;
    label: string;
    value: string;
}

const languages: Language[] = [
    { code: 'US', label: 'languages:english', value: 'en' },
    { code: 'FI', label: 'languages:finnish', value: 'fi' },
    { code: 'SE', label: 'languages:swedish', value: 'sv' },
];

interface UseLanguageSelector {
    renderCurrentFlag: string;
    languageToFlag: (isoCode: string) => string;
    languages: Language[];
    openLanguageMenu: () => void;
    renderLanguageButton: JSX.Element;
}

export const useLanguageSelector = (): UseLanguageSelector => {
    const { i18n } = useTranslation();
    const [value, setValue] = useState(i18n.language);
    const dispatch = useDispatch();

    useEffect(() => {
        setValue(i18n.language);
    }, [i18n.language]);

    const languageToFlag = (isoCode: string): string => {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode;
    };

    const openLanguageMenu = (): void => {
        dispatch(toggleLanguageSelector(true));
    };

    const language = languages.find(c => c.value === value) as Language;

    const renderCurrentFlag = !!language && !!language.code ? languageToFlag(language.code) : languageToFlag('US');

    const renderLanguageButton = (
        <StyledLanguageSelector onClick={openLanguageMenu}>{renderCurrentFlag}</StyledLanguageSelector>
    );

    return { renderCurrentFlag, languageToFlag, languages, openLanguageMenu, renderLanguageButton };
};

const StyledLanguageSelector = styled(Button)`
    padding: 0 !important;

    .MuiButton-label {
        font-size: 1.5rem;
    }
`;
