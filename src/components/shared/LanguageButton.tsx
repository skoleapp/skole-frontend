import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useLanguageContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { LanguageFlag } from './LanguageFlag';

export const LanguageButton: React.FC = () => {
  const { t, lang } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();
  const { isMobile } = useMediaQueries();
  const size = isMobile ? 'small' : 'medium';

  return (
    <Tooltip title={t('common-tooltips:language')}>
      <IconButton onClick={handleOpenLanguageMenu} size={size}>
        <LanguageFlag lang={lang} />
      </IconButton>
    </Tooltip>
  );
};
