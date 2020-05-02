import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';

import { useNotificationsContext } from '../context';
import { useTranslation } from '../i18n';
import { ShareNavigator, UseOptions } from '../types';
import { useDrawer } from './useDrawer';

export const useOptions = (shareText?: string): UseOptions => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const drawerProps = useDrawer(t('common:options'));
    const { onClose, renderHeader: renderOptionsHeader } = drawerProps;

    const handleShare = (e: SyntheticEvent): void => {
        const shareNavigator: ShareNavigator = window.navigator;

        if (!!shareNavigator && !!shareNavigator.share) {
            shareNavigator
                .share({
                    title: 'Skole',
                    text: shareText || t('common:slogan'),
                    url: window.location.href,
                })
                .then(() => {
                    toggleNotification(t('notifications:linkShared'));
                })
                .catch(() => {
                    toggleNotification(t('notifications:sharingError'));
                });
        } else if (!!shareNavigator && !!shareNavigator.clipboard) {
            shareNavigator.clipboard.writeText(window.location.href);
            toggleNotification(t('notifications:linkCopied'));
        } else {
            toggleNotification(t('notifications:sharingError'));
        }
        onClose(e);
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
        drawerProps: R.omit(['renderHeader'], drawerProps),
        renderOptionsHeader,
    };
};
