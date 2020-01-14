import { IconButton, IconButtonProps } from '@material-ui/core';

import { AnyAction } from 'redux';
import React from 'react';
import { Settings } from '@material-ui/icons';
import { toggleSettings } from '../../actions';
import { useDispatch } from 'react-redux';

export const SettingsButton: React.FC<IconButtonProps> = props => {
    const dispatch = useDispatch();
    const handleSettingsClick = (): AnyAction => dispatch((toggleSettings(true) as unknown) as AnyAction);

    return (
        <IconButton onClick={handleSettingsClick} {...props}>
            <Settings />
        </IconButton>
    );
};
