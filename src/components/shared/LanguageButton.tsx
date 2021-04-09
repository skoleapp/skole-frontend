import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useLanguageContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { useMediaQueries } from 'styles';

import { LanguageFlag } from './LanguageFlag';

export const LanguageButton: React.FC = () => {
  const { t, lang } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();
  const { smDown } = useMediaQueries();
  const size = smDown ? 'small' : 'medium';

  return (
    <Tooltip title={t('common-tooltips:language')}>
      <IconButton onClick={handleOpenLanguageMenu} size={size}>
        <LanguageFlag lang={lang} />
      </IconButton>
    </Tooltip>
  );
};
