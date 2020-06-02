import { DrawerProps, IconButton, ListItemText, MenuItem, Tooltip } from '@material-ui/core';
import { FlagOutlined, InfoOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalHeader } from '../components';
import { useDeviceContext, useNotificationsContext } from '../context';
import { UseDrawer } from '../types';
import { useOpen } from './useOpen';

export const useDrawer = (header?: string): UseDrawer => {
    const { open, handleOpen, handleClose } = useOpen();
    const isMobile = useDeviceContext();

    const handleOpenDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleOpen();
    };

    const handleCloseDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleClose();
    };

    const renderHeader = <ModalHeader text={header} onCancel={handleCloseDrawer} />;

    return {
        open,
        handleOpen: handleOpenDrawer,
        onClose: handleCloseDrawer,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

interface UseInfoDrawer extends DrawerProps {
    renderInfoHeader: JSX.Element;
    renderInfoButton: JSX.Element;
}

export const useInfoDrawer = (): UseInfoDrawer => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();

    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(
        t('common:info'),
    );

    const renderInfoButton = (
        <Tooltip title={t('common:infoTooltip')}>
            <IconButton onClick={handleOpenInfo} color={isMobile ? 'secondary' : 'default'}>
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    return { renderInfoHeader, renderInfoButton, ...infoDrawerProps };
};

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

interface UseActionsDrawer extends DrawerProps {
    renderActionsHeader: JSX.Element;
    handleCloseActions: (e: SyntheticEvent) => void;
    renderShareAction: JSX.Element;
    renderReportAction: JSX.Element;
    renderActionsButton: JSX.Element;
}

export const useActionsDrawer = (shareText?: string): UseActionsDrawer => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();

    const {
        renderHeader: renderActionsHeader,
        handleOpen: handleOpenActions,
        onClose: handleCloseActions,
        ...actionsDrawerProps
    } = useDrawer(t('common:actions'));

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

        handleCloseActions(e);
    };

    const renderShareAction = (
        <MenuItem onClick={handleShare}>
            <ListItemText>
                <ShareOutlined /> {t('common:share')}
            </ListItemText>
        </MenuItem>
    );

    const renderReportAction = (
        <MenuItem disabled>
            <ListItemText>
                <FlagOutlined /> {t('common:reportAbuse')}
            </ListItemText>
        </MenuItem>
    );

    const renderActionsButton = (
        <Tooltip title={t('common:actionsTooltip')}>
            <IconButton onClick={handleOpenActions} color={isMobile ? 'secondary' : 'default'}>
                <MoreHorizOutlined />
            </IconButton>
        </Tooltip>
    );

    return {
        renderActionsHeader,
        handleCloseActions,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        ...actionsDrawerProps,
    };
};
