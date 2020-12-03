import { IconButton, ListItemIcon, ListItemText, MenuItem, Size, Tooltip } from '@material-ui/core';
import { FlagOutlined, MoreHorizOutlined, ShareOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps, ShareParams } from 'types';
import { useDialogButton } from './useDialogButton';

import { useOpen } from './useOpen';
import { useShare } from './useShare';

interface ActionsButtonProps {
  onClick: (e: SyntheticEvent) => void;
  size: Size;
}

interface UseActionsDialog {
  actionsDialogOpen: boolean;
  actionsDialogHeaderProps: DialogHeaderProps;
  handleCloseActionsDialog: (e: SyntheticEvent) => void;
  renderShareAction: false | JSX.Element;
  renderReportAction: JSX.Element;
  renderActionsButton: JSX.Element;
  renderShareButton: JSX.Element;
  actionsButtonProps: ActionsButtonProps;
}

export const useActionsDialog = ({ query, text }: ShareParams): UseActionsDialog => {
  const { t } = useTranslation();
  const { handleShare: _handleShare, renderShareButton } = useShare({ query, text });
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

  const handleShare = (e: SyntheticEvent): void => {
    handleCloseActionsDialog(e);
    _handleShare();
  };

  const actionsDialogHeaderProps = {
    text: t('common:actions'),
    onCancel: handleCloseActionsDialog,
  };

  const actionsButtonProps = {
    ...dialogButtonProps,
    onClick: handleOpenActionsDialog,
  };

  const renderShareAction = (
    <MenuItem onClick={handleShare}>
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
    renderShareButton,
  };
};
