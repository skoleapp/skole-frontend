import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import { useConfirmContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { SkoleButton } from '../shared';
import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

const useStyles = makeStyles({
  dialogContentText: {
    textAlign: 'center',
  },
});

export const ConfirmationDialog: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    dialogOpen,
    handleCancel,
    handleConfirm,
    confirmOptions: { title, description },
  } = useConfirmContext();

  return (
    <SkoleDialog open={dialogOpen} fullScreen={false}>
      <DialogHeader onCancel={handleCancel} text={title} emoji="🤔" />
      <DialogContent>
        <DialogContentText className={classes.dialogContentText} color="textPrimary">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <SkoleButton color="default" onClick={handleCancel} fullWidth>
          {t('common:cancel')}
        </SkoleButton>
        <SkoleButton onClick={handleConfirm} fullWidth>
          {t('common:confirm')}
        </SkoleButton>
      </DialogActions>
    </SkoleDialog>
  );
};
