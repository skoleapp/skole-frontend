import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import { useSettingsContext } from 'context';
import { useMediaQueries } from 'hooks';
import React from 'react';

export const SettingsButton: React.FC<IconButtonProps> = (props) => {
  const { isMobile } = useMediaQueries();
  const color = isMobile ? 'secondary' : 'primary';
  const size = isMobile ? 'small' : 'medium';
  const { handleOpenSettingsDialog } = useSettingsContext();

  return (
    <IconButton onClick={handleOpenSettingsDialog} color={color} size={size} {...props}>
      <SettingsOutlined />
    </IconButton>
  );
};
