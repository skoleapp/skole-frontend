import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotificationsContext } from '../context';
import { UseDrawer, UseOptions } from '../types';
import { useDrawer } from './useDrawer';

interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}

interface ShareNavigator extends Navigator {
    share?: (data?: ShareData) => Promise<void>;
}

interface ShareNavigatorWindow extends Window {
    navigator: ShareNavigator;
}

export const useOptions = (shareText?: string): UseOptions => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const drawerProps = useDrawer(t('common:options'));
    const { onClose: closeOptions, renderHeader: renderOptionsHeader } = drawerProps;

    const handleShare = async (e: SyntheticEvent): Promise<void> => {
        const { navigator } = window as ShareNavigatorWindow;

        if (!!navigator && !!navigator.share) {
            try {
                await navigator.share({
                    title: 'Skole',
                    text: shareText || t('common:slogan'),
                    url: window.location.href,
                });
            } catch {
                toggleNotification(t('notifications:sharingError'));
            }
        } else if (!!navigator && !!navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toggleNotification(t('notifications:linkCopied'));
        } else {
            toggleNotification(t('notifications:sharingError'));
        }

        closeOptions(e);
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
        drawerProps: R.omit(['renderHeader'], drawerProps) as Omit<UseDrawer, 'renderHeader'>,
        renderOptionsHeader,
    };
};
