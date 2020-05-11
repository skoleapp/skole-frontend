import { MenuItem } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useDrawer, useLanguageSelector } from '../../utils';
import { ModalHeader, StyledDrawer, StyledList } from '../shared';

export const LanguageSelectorModal: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { anchor } = useDrawer(t('common:language'));
    const { languageSelectorOpen, toggleLanguageSelector, languages, languageToFlag } = useLanguageSelector();

    const handleLanguageChange = (val: string) => (): void => {
        i18n.changeLanguage(val);
        toggleLanguageSelector(false);
    };

    const handleClose = (): void => {
        toggleLanguageSelector(false);
    };

    const renderLanguageList = (
        <StyledList>
            {languages.map((l, i) => (
                <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
                    {t(l.label)} {languageToFlag(l.code)}
                </MenuItem>
            ))}
        </StyledList>
    );

    return (
        <StyledDrawer open={languageSelectorOpen} anchor={anchor} onClose={handleClose}>
            <ModalHeader text={t('common:language')} onCancel={handleClose} />
            {renderLanguageList}
        </StyledDrawer>
    );
};
