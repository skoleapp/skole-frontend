import { Button, Tooltip } from '@material-ui/core';
import { useLanguageContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { LanguageFlag } from './LanguageFlag';

export const LanguageButton: React.FC = () => {
  const { t, lang } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();

  return (
    <Tooltip title={t('common-tooltips:language')}>
      <Button onClick={handleOpenLanguageMenu}>
        <LanguageFlag lang={lang} />
      </Button>
    </Tooltip>
  );
};
