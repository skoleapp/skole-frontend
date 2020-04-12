import { IconButton, IconButtonProps } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import React from 'react';

import { useSettingsContext } from '../../utils';

export const SettingsButton: React.FC<IconButtonProps> = props => {
    const { toggleSettings } = useSettingsContext();

    return (
        <IconButton onClick={(): void => toggleSettings(true)} {...props}>
            <Settings />
        </IconButton>
    );
};
