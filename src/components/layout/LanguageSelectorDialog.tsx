import { List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { useLanguageContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { LANGUAGES } from 'utils';
import { LanguageFlag, ResponsiveDialog } from '../shared';

export const LanguageSelectorDialog: React.FC = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const { languageSelectorOpen, handleCloseLanguageMenu } = useLanguageContext();

  const handleLanguageChange = (val: string) => async (): Promise<void> => {
    handleCloseLanguageMenu();
    await Router.push(asPath, asPath, { locale: val });

    // Save selection to a cookie: https://github.com/vinissimus/next-translate/blob/1.0.0/README.md#10-how-to-save-the-user-defined-language
    document.cookie = `NEXT_LOCALE=${val}`;
  };

  const dialogHeaderProps = {
    text: t('common:changeLanguage'),
    onCancel: handleCloseLanguageMenu,
  };

  const renderLanguages = LANGUAGES.map((l, i) => (
    <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
      <ListItemIcon>
        <LanguageFlag lang={l.value} />
      </ListItemIcon>
      <ListItemText>{t(l.label)}</ListItemText>
    </MenuItem>
  ));

  return (
    <ResponsiveDialog
      open={languageSelectorOpen}
      onClose={handleCloseLanguageMenu}
      dialogHeaderProps={dialogHeaderProps}
    >
      <List>{renderLanguages}</List>
    </ResponsiveDialog>
  );
};
