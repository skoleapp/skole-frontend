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

    const handleShare = async (e: SyntheticEvent): Promise<void> => {
        const shareNavigator: ShareNavigator = window.navigator;

        if (!!shareNavigator && !!shareNavigator.share) {
            try {
                await shareNavigator.share({
                    title: 'Skole',
                    text: shareText || t('common:slogan'),
                    url: window.location.href,
                });

                toggleNotification(t('notifications:linkShared'));
            } catch {
                toggleNotification(t('notifications:sharingError'));
            }
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
