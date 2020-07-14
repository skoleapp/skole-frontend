import { DrawerProps, IconButton, ListItemText, MenuItem, Tooltip } from '@material-ui/core';
import { FlagOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ShareParams } from 'types';

import { useDrawer } from './useDrawer';
import { useResponsiveIconButtonProps } from './useResponsiveIconButtonProps';
import { useShare } from './useShare';

interface UseActionsDrawer extends DrawerProps {
    renderActionsHeader: JSX.Element;
    handleCloseActions: (e: SyntheticEvent) => void;
    renderShareAction: false | JSX.Element;
    renderReportAction: JSX.Element;
    renderActionsButton: JSX.Element;
}

export const useActionsDrawer = (shareParams: ShareParams): UseActionsDrawer => {
    const { t } = useTranslation();
    const { handleShare } = useShare(shareParams);
    const iconButtonProps = useResponsiveIconButtonProps();

    const {
        renderHeader: renderActionsHeader,
        handleOpen: handleOpenActions,
        onClose: handleCloseActions,
        ...actionsDrawerProps
    } = useDrawer(t('common:actions'));

    const handlePreShare = (e: SyntheticEvent): void => {
        handleCloseActions(e);
        handleShare();
    };

    const renderShareAction = (
        <MenuItem onClick={handlePreShare}>
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
        <Tooltip title={t('tooltips:actions')}>
            <IconButton onClick={handleOpenActions} {...iconButtonProps}>
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
