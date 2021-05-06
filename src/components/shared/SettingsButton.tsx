import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import { useMediaQueryContext, useSettingsContext } from 'context';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export const SettingsButton: React.FC<IconButtonProps> = (props) => {
  const { smDown } = useMediaQueryContext();
  const { t } = useTranslation();
  const color = smDown ? 'secondary' : 'default';
  const { handleOpenSettingsDialog } = useSettingsContext();

  return (
    <Tooltip title={t('common-tooltips:openSettings')}>
      <IconButton onClick={handleOpenSettingsDialog} color={color} size="small" {...props}>
        <SettingsOutlined />
      </IconButton>
    </Tooltip>
  );
};
