import { IconButton, ListItemIcon, ListItemText, MenuItem, Size, Tooltip } from '@material-ui/core';
import { FlagOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeaderProps, ShareParams } from 'types';

import { useMediaQueries } from './useMediaQueries';
import { useOpen } from './useOpen';
import { useShare } from './useShare';

interface UseActionsDialog {
    actionsDialogOpen: boolean;
    actionsDialogHeaderProps: DialogHeaderProps;
    handleCloseActionsDialog: () => void;
    renderShareAction: false | JSX.Element;
    renderReportAction: JSX.Element;
    renderActionsButton: JSX.Element;
    renderDefaultActionsButton: JSX.Element;
}

export const useActionsDialog = (shareParams: ShareParams): UseActionsDialog => {
    const { t } = useTranslation();
    const { handleShare } = useShare(shareParams);
    const { isMobileOrTablet } = useMediaQueries();
    const { open: actionsDialogOpen, handleOpen: handleOpenActions, handleClose: handleCloseActionsDialog } = useOpen();
    const tooltip = t('tooltips:actions');

    const handlePreShare = (): void => {
        handleCloseActionsDialog();
        handleShare();
    };

    const actionsDialogHeaderProps = {
        text: t('common:actions'),
        onCancel: handleCloseActionsDialog,
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
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        renderDefaultActionsButton,
    };
};