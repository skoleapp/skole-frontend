import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import { useDarkModeContext, useSettingsContext } from 'context';
import { useMediaQueries } from 'hooks';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export const SettingsButton: React.FC<IconButtonProps> = (props) => {
  const { smDown } = useMediaQueries();
  const { t } = useTranslation();
  const { dynamicPrimaryColor } = useDarkModeContext();
  const color = smDown ? 'secondary' : dynamicPrimaryColor;
  const size = smDown ? 'small' : 'medium';
  const { handleOpenSettingsDialog } = useSettingsContext();

  return (
    <Tooltip title={t('common-tooltips:openSettings')}>
      <IconButton onClick={handleOpenSettingsDialog} color={color} size={size} {...props}>
        <SettingsOutlined />
      </IconButton>
    </Tooltip>
  );
};
