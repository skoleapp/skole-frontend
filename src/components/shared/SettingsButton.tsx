import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import { useSettingsContext } from 'context';
import React, { forwardRef } from 'react';

export const SettingsButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { toggleSettings } = useSettingsContext();

  return (
    <IconButton onClick={(): void => toggleSettings(true)} {...props} ref={ref}>
      <SettingsOutlined />
    </IconButton>
  );
});
