import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { useActionsContext, useShareContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { Emoji } from '../shared';
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

  const handleClickShare = (): void => {
    handleCloseActionsDialog();
    handleOpenShareDialog(shareDialogParams);
  };

  const handleClickDelete = (): void => {
    handleCloseActionsDialog();
    !!deleteActionParams?.callback && deleteActionParams.callback();
  };

  const actionsDialogHeaderProps = {
    onCancel: handleCloseActionsDialog,
  };

  const renderShareAction = !hideShareAction && (
    <MenuItem onClick={handleClickShare}>
      <ListItemIcon>
        <Emoji emoji="📤" noSpace />
      </ListItemIcon>
      <ListItemText>{shareText}</ListItemText>
    </MenuItem>
  );

  const renderDeleteAction = !hideDeleteAction && (
    <MenuItem onClick={handleClickDelete} disabled={deleteActionParams?.disabled}>
      <ListItemIcon>
        <Emoji emoji="❌" noSpace />
      </ListItemIcon>
      <ListItemText>{deleteActionParams?.text}</ListItemText>
    </MenuItem>
  );

  const renderReportAction = !hideReportAction && (
    <MenuItem disabled>
      <ListItemIcon>
        <Emoji emoji="🤦‍♂️" noSpace />
      </ListItemIcon>
      <ListItemText>{t('common:reportAbuse')}</ListItemText>
    </MenuItem>
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
