import { Button, makeStyles, Tooltip } from '@material-ui/core';
import { useLanguageSelectorContext } from 'context';
import { useTranslation } from 'lib';
import { useEffect, useState } from 'react';
import React from 'react';
import { LanguageSelectorContextType } from 'types';

const useStyles = makeStyles({
  root: {
    padding: 0,
    fontSize: '1.5rem',
  },
});

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

interface UseLanguageSelector extends LanguageSelectorContextType {
  renderCurrentFlag: string;
  languageToFlag: (isoCode: string) => string;
  languages: Language[];
  openLanguageMenu: () => void;
  renderLanguageButton: JSX.Element;
}

export const useLanguageSelector = (): UseLanguageSelector => {
  const classes = useStyles();
  const { t, lang } = useTranslation();
  const [value, setValue] = useState(lang);

  const {
    toggleLanguageSelector,
    languageSelectorOpen,
  } = useLanguageSelectorContext();

  useEffect(() => {
    setValue(lang);
  }, [lang]);

  const languageToFlag = (isoCode: string): string =>
    typeof String.fromCodePoint !== 'undefined'
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) =>
            String.fromCodePoint(char.charCodeAt(0) + 127397),
          )
      : isoCode;

  const openLanguageMenu = (): void => toggleLanguageSelector(true);
  const language = languages.find((c) => c.value === value) as Language;

  const renderCurrentFlag =
    !!language && !!language.code
      ? languageToFlag(language.code)
      : languageToFlag('US');

  const renderLanguageButton = (
    <Tooltip title={t('tooltips:language')}>
      <Button className={classes.root} onClick={openLanguageMenu}>
        {renderCurrentFlag}
      </Button>
    </Tooltip>
  );

  return {
    renderCurrentFlag,
    languageToFlag,
    languages,
    openLanguageMenu,
    renderLanguageButton,
    languageSelectorOpen,
    toggleLanguageSelector,
  };
};
