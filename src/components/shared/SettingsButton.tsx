import { IconButton, IconButtonProps } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import { toggleSettings } from '../../actions';

export const SettingsButton: React.FC<IconButtonProps> = props => {
    const dispatch = useDispatch();
    const handleSettingsClick = (): AnyAction => dispatch((toggleSettings(true) as unknown) as AnyAction);

    return (
        <IconButton onClick={handleSettingsClick} {...props}>
            <Settings />
        </IconButton>
    );
};
