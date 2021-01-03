import { IconButton, ListItemIcon, ListItemText, MenuItem, Size, Tooltip } from '@material-ui/core';
import { FlagOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import { useShareContext } from 'context';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps, ShareParams } from 'types';
import { useDialogButton } from './useDialogButton';

import { useOpen } from './useOpen';

interface ActionsButtonProps {
  onClick: (e: SyntheticEvent) => void;
  size: Size;
}

interface UseActionsDialogParams {
  share?: string;
  target?: string;
  shareParams?: ShareParams;
}

interface UseActionsDialog {
  actionsDialogOpen: boolean;
  actionsDialogHeaderProps: DialogHeaderProps;
  handleCloseActionsDialog: (e: SyntheticEvent) => void;
  renderShareAction: JSX.Element | false;
  renderReportAction: JSX.Element;
  renderActionsButton: JSX.Element;
  actionsButtonProps: ActionsButtonProps;
}

// Custom hook for rendering common actions and providing helpers and props for multiple action dialogs.
export const useActionsDialog = ({
  share,
  target = '',
  shareParams = {},
}: UseActionsDialogParams): UseActionsDialog => {
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const dialogButtonProps = useDialogButton();

  const {
    open: actionsDialogOpen,
    handleOpen: _handleOpenActionsDialog,
    handleClose: _handleCloseActionsDialog,
  } = useOpen();

  const handleOpenActionsDialog = (e: SyntheticEvent): void => {
    e.stopPropagation();
    _handleOpenActionsDialog();
  };

  const handleCloseActionsDialog = (e: SyntheticEvent): void => {
    e.stopPropagation();
    _handleCloseActionsDialog();
  };

  const handleClickShare = (e: SyntheticEvent): void => {
    handleCloseActionsDialog(e);
    handleOpenShareDialog(shareParams);
  };

  const actionsDialogHeaderProps = {
    onCancel: handleCloseActionsDialog,
  };

  const actionsButtonProps = {
    ...dialogButtonProps,
    onClick: handleOpenActionsDialog,
  };

  const renderShareAction = (
    <MenuItem onClick={handleClickShare}>
      <ListItemIcon>
        <ShareOutlined />
      </ListItemIcon>
      <ListItemText>{share}</ListItemText>
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

  const renderActionsButton = (
    <Tooltip title={t('tooltips:actions', { target })}>
      <IconButton {...actionsButtonProps}>
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
    actionsButtonProps,
  };
};
