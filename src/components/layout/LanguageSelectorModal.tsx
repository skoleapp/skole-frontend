import { Drawer, MenuItem } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';
import { useDrawer, useLanguageSelector } from '../../utils';
import { ModalHeader, StyledList } from '../shared';

export const LanguageSelectorModal: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { anchor } = useDrawer();
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
        <Drawer open={languageSelectorOpen} anchor={anchor} onClose={handleClose}>
            <ModalHeader title={t('common:language')} onCancel={handleClose} />
            {renderLanguageList}
        </Drawer>
    );
};
