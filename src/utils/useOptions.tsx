import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

import { toggleNotification } from '../actions';
import { useTranslation } from '../i18n';
import { UseOptions } from '../types';
import { useDrawer } from './useDrawer';

export const useOptions = (): UseOptions => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const drawerProps = useDrawer(t('common:actions'));
    const { onClose, renderHeader: renderOptionsHeader } = drawerProps;

    const handleShare = (e: SyntheticEvent): void => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        dispatch(toggleNotification(t('notifications:linkCopied')));
        onClose();
    };

    const renderShareOption = (
        <MenuItem onClick={handleShare}>
            <ListItemText>
                <ShareOutlined /> {t('common:share')}
            </ListItemText>
        </MenuItem>
    );

    const renderReportOption = (
        <MenuItem disabled>
            <ListItemText>
                <FlagOutlined /> {t('common:reportAbuse')}
            </ListItemText>
        </MenuItem>
    );

    return {
        renderShareOption,
        renderReportOption,
        drawerProps,
        renderOptionsHeader,
    };
};
