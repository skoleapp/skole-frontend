import { IconButton, IconButtonProps } from '@material-ui/core';
import { SettingsOutlined } from '@material-ui/icons';
import React, { forwardRef } from 'react';

import { useSettingsContext } from '../../context';

export const SettingsButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
    const { toggleSettings } = useSettingsContext();

    return (
        <IconButton onClick={(): void => toggleSettings(true)} {...props} ref={ref}>
            <SettingsOutlined />
        </IconButton>
    );
});
