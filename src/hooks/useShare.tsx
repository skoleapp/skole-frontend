import { IconButton, Tooltip } from '@material-ui/core';
import { ShareOutlined } from '@material-ui/icons';
import { useNotificationsContext } from 'context';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShareParams } from 'types';

import { useResponsiveIconButtonProps } from './useResponsiveIconButtonProps';

interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}

interface ShareNavigator extends Omit<Navigator, 'share'> {
    share?: (data?: ShareData) => Promise<void>;
}

interface ShareNavigatorWindow extends Omit<Window, 'navigator'> {
    navigator: ShareNavigator;
}

interface UseShare {
    renderShareButton: JSX.Element;
    handleShare: () => void;
}

export const useShare = ({ query = '', text }: ShareParams): UseShare => {
    const { t } = useTranslation();
    const iconButtonProps = useResponsiveIconButtonProps();
    const { toggleNotification } = useNotificationsContext();

    const handleShare = async (): Promise<void> => {
        const { navigator } = window as ShareNavigatorWindow;
        const url = `${window.location.href + query}`;

        if (!!navigator && !!navigator.share) {
            try {
                await navigator.share({ title: 'Skole', text, url });
            } catch {
                // User cancelled.
            }
        } else if (!!navigator && !!navigator.clipboard) {
            navigator.clipboard.writeText(url);
            toggleNotification(t('notifications:linkCopied'));
        } else {
            toggleNotification(t('notifications:sharingError'));
        }
    };

    const renderShareButton = (
        <Tooltip title={t('tooltips:share')}>
            <IconButton onClick={handleShare} {...iconButtonProps}>
                <ShareOutlined />
            </IconButton>
        </Tooltip>
    );

    return { renderShareButton, handleShare };
};
