import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import { useAuthContext, useInviteContext } from 'context';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';

import { CustomInviteDialog } from '../dialogs';
import { Emoji } from '../shared';

export const GeneralInviteDialog: React.FC = () => {
  const { t } = useTranslation();
  const { inviteCodeUsages } = useAuthContext();
  const { generalInviteDialogOpen, handleCloseGeneralInviteDialog } = useInviteContext();

  const renderInviteDialogHeader = useMemo(
    () => (
      <>
        {t('common:inviteDialogHeader')}
        <Emoji emoji="🤝" />
      </>
    ),
    [t],
  );

  const renderInviteDialogText = useMemo(
    () => (
      <DialogContentText>
        <Typography variant="body2">
          {t('common:inviteDialogText', { inviteCodeUsages })}
        </Typography>
      </DialogContentText>
    ),
    [t, inviteCodeUsages],
  );

  return (
    <CustomInviteDialog
      open={generalInviteDialogOpen}
      handleClose={handleCloseGeneralInviteDialog}
      header={renderInviteDialogHeader}
      dynamicContent={[renderInviteDialogText]}
    />
  );
};
