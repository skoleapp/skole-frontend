import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useLanguageContext, useMediaQueryContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { LanguageFlag } from './LanguageFlag';

export const LanguageButton: React.FC<IconButtonProps> = (props) => {
  const { t, lang } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();
  const { smDown } = useMediaQueryContext();
  const size = smDown ? 'small' : 'medium';

  return (
    <Tooltip title={t('common-tooltips:language')}>
      <IconButton onClick={handleOpenLanguageMenu} size={size} {...props}>
        <LanguageFlag lang={lang} />
      </IconButton>
    </Tooltip>
  );
};
