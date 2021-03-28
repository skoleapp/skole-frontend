import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { useLanguageContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { LANGUAGES } from 'utils';

import { LanguageFlag } from '../shared';
import { ResponsiveDialog } from './ResponsiveDialog';

export const LanguageSelectorDialog: React.FC = () => {
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const { languageSelectorOpen, handleCloseLanguageMenu } = useLanguageContext();

  const handleLanguageChange = useCallback(
    (val: string) => async (): Promise<void> => {
      handleCloseLanguageMenu();
      await Router.push(asPath, asPath, { locale: val });

      // Save selection to a cookie: https://github.com/vinissimus/next-translate/blob/1.0.0/README.md#10-how-to-save-the-user-defined-language
      document.cookie = `NEXT_LOCALE=${val}`;
    },
    [asPath, handleCloseLanguageMenu],
  );

  const dialogHeaderProps = {
    text: t('common:changeLanguage'),
    emoji: '🌐',
    onCancel: handleCloseLanguageMenu,
  };

  const renderLanguages = useMemo(
    () =>
      LANGUAGES.map((l, i) => (
        <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
          <ListItemIcon>
            <LanguageFlag lang={l.value} />
          </ListItemIcon>
          <ListItemText>{t(l.label)}</ListItemText>
        </MenuItem>
      )),
    [handleLanguageChange, t],
  );

  return (
    <ResponsiveDialog
      open={languageSelectorOpen}
      onClose={handleCloseLanguageMenu}
      dialogHeaderProps={dialogHeaderProps}
      list
    >
      <List>{renderLanguages}</List>
    </ResponsiveDialog>
  );
};
