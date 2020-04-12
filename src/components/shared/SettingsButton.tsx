import { IconButton, IconButtonProps } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import React from 'react';

import { useSkoleContext } from '../../context';

export const SettingsButton: React.FC<IconButtonProps> = props => {
    const { toggleSettings } = useSkoleContext();

    return (
        <IconButton onClick={(): void => toggleSettings(true)} {...props}>
            <Settings />
        </IconButton>
    );
};
