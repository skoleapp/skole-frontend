import { Drawer, List, MenuItem } from '@material-ui/core';
import { useDrawer, useLanguageSelector } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { ModalHeader } from '..';

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

    const renderModalHeader = <ModalHeader text={t('common:language')} onCancel={handleClose} />;

    const renderLanguageList = (
        <List>
            {languages.map((l, i) => (
                <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
                    {t(l.label)} {languageToFlag(l.code)}
                </MenuItem>
            ))}
        </List>
    );

    return (
        <Drawer open={languageSelectorOpen} anchor={anchor} onClose={handleClose}>
            {renderModalHeader}
            {renderLanguageList}
        </Drawer>
    );
};
