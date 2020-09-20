import { List, MenuItem } from '@material-ui/core';
import { useLanguageSelector } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { ResponsiveDialog } from '..';

export const LanguageSelectorDialog: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { languageSelectorOpen, toggleLanguageSelector, languages, languageToFlag } = useLanguageSelector();

    const handleLanguageChange = (val: string) => (): void => {
        i18n.changeLanguage(val);
        toggleLanguageSelector(false);
    };

    const handleClose = (): void => {
        toggleLanguageSelector(false);
    };

    const dialogHeaderProps = {
        text: t('common:language'),
        onCancel: handleClose,
    };

    return (
        <ResponsiveDialog open={languageSelectorOpen} onClose={handleClose} dialogHeaderProps={dialogHeaderProps}>
            <List>
                {languages.map((l, i) => (
                    <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
                        {t(l.label)} {languageToFlag(l.code)}
                    </MenuItem>
                ))}
            </List>
        </ResponsiveDialog>
    );
};
