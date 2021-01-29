import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import { useConfirmContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

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
        <Button onClick={handleCancel} fullWidth>
          {t('common:cancel')}
        </Button>
        <Button color="primary" onClick={handleConfirm} fullWidth>
          {t('common:confirm')}
        </Button>
      </DialogActions>
    </SkoleDialog>
  );
};
