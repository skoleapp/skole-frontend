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
export const useActionsDialog = (shareParams?: ShareParams): UseActionsDialog => {
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const dialogButtonProps = useDialogButton();
  const tooltip = t('tooltips:actions');

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
    handleOpenShareDialog(shareParams!); // Make non-null assertion since we can be sure this function call happens only when the `shareParams` object exists.
  };

  const actionsDialogHeaderProps = {
    text: t('common:actions'),
    onCancel: handleCloseActionsDialog,
  };

  const actionsButtonProps = {
    ...dialogButtonProps,
    onClick: handleOpenActionsDialog,
  };

  const renderShareAction = !!shareParams && (
    <MenuItem onClick={handleClickShare}>
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

  const renderActionsButton = (
    <Tooltip title={tooltip}>
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
