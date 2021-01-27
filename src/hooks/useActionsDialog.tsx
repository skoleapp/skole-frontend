import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { Size } from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import FlagOutlined from '@material-ui/icons/FlagOutlined';
import MoreHorizOutlined from '@material-ui/icons/MoreHorizOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
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
  actionsButtonTooltip: string;
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
  actionsButtonTooltip,
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
    <Tooltip title={actionsButtonTooltip}>
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
