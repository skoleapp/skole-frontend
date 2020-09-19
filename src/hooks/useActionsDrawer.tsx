import { DrawerProps, IconButton, ListItemIcon, ListItemText, MenuItem, Size, Tooltip } from '@material-ui/core';
import { FlagOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { ShareParams } from 'types';

import { useDrawer } from './useDrawer';
import { useMediaQueries } from './useMediaQueries';
import { useShare } from './useShare';

interface UseActionsDrawer extends DrawerProps {
    renderActionsHeader: JSX.Element;
    handleCloseActions: (e: SyntheticEvent) => void;
    renderShareAction: false | JSX.Element;
    renderReportAction: JSX.Element;
    renderActionsButton: JSX.Element;
    renderDefaultActionsButton: JSX.Element;
}

export const useActionsDrawer = (shareParams: ShareParams): UseActionsDrawer => {
    const { t } = useTranslation();
    const { handleShare } = useShare(shareParams);
    const { isMobileOrTablet } = useMediaQueries();
    const tooltip = t('tooltips:actions');

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
            <ListItemIcon>
                <ShareOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:share')}</ListItemText>
        </MenuItem>
    );

    const renderReportAction = (
        <MenuItem disabled>
            <ListItemIcon>
                <FlagOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:reportAbuse')}</ListItemText>
        </MenuItem>
    );

    const commonActionsButtonProps = {
        onClick: handleOpenActions,
        size: 'small' as Size,
    };

    const renderActionsButton = (
        <Tooltip title={tooltip}>
            <IconButton {...commonActionsButtonProps} color={isMobileOrTablet ? 'secondary' : 'default'}>
                <MoreHorizOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDefaultActionsButton = (
        <Tooltip title={tooltip}>
            <IconButton {...commonActionsButtonProps} color="default">
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
        renderDefaultActionsButton,
        ...actionsDrawerProps,
    };
};
