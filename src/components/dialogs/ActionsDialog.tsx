import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import FlagOutlined from '@material-ui/icons/FlagOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import { useActionsContext, useShareContext } from 'context';
import { useTranslation } from 'lib';
import React, { useCallback, useMemo } from 'react';

import { ResponsiveDialog } from './ResponsiveDialog';

export const ActionsDialog: React.FC = () => {
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();

  const {
    actionsDialogOpen,
    handleCloseActionsDialog,
    actionsDialogParams: {
      shareText,
      shareDialogParams = {},
      deleteActionParams,
      renderCustomActions,
      hideShareAction,
      hideDeleteAction,
      hideReportAction,
    },
  } = useActionsContext();

  const handleClickShare = useCallback((): void => {
    handleCloseActionsDialog();
    handleOpenShareDialog(shareDialogParams);
  }, [handleCloseActionsDialog, handleOpenShareDialog, shareDialogParams]);

  const handleClickDelete = useCallback((): void => {
    handleCloseActionsDialog();

    if (deleteActionParams?.callback) {
      deleteActionParams.callback();
    }
  }, [deleteActionParams, handleCloseActionsDialog]);

  const actionsDialogHeaderProps = {
    onClose: handleCloseActionsDialog,
  };

  const renderShareAction = useMemo(
    () =>
      !hideShareAction && (
        <MenuItem onClick={handleClickShare}>
          <ListItemIcon>
            <ShareOutlined />
          </ListItemIcon>
          <ListItemText>{shareText}</ListItemText>
        </MenuItem>
      ),
    [handleClickShare, hideShareAction, shareText],
  );

  const renderDeleteAction = useMemo(
    () =>
      !hideDeleteAction && (
        <MenuItem onClick={handleClickDelete} disabled={deleteActionParams?.disabled}>
          <ListItemIcon>
            <DeleteForeverOutlined />
          </ListItemIcon>
          <ListItemText>{deleteActionParams?.text}</ListItemText>
        </MenuItem>
      ),
    [deleteActionParams?.disabled, deleteActionParams?.text, handleClickDelete, hideDeleteAction],
  );

  const renderReportAction = useMemo(
    () =>
      !hideReportAction && (
        <MenuItem disabled>
          <ListItemIcon>
            <FlagOutlined />
          </ListItemIcon>
          <ListItemText>{t('common:reportAbuse')}</ListItemText>
        </MenuItem>
      ),
    [hideReportAction, t],
  );

  return (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
      list
    >
      <List>
        {renderShareAction}
        {renderCustomActions}
        {renderDeleteAction}
        {renderReportAction}
      </List>
    </ResponsiveDialog>
  );
};
