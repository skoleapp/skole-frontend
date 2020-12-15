import { useTranslation } from 'lib';
import React from 'react';
import {
  Button,
  DialogActions,
  DialogContentText,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { useConfirmContext } from 'context';
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
      <DialogHeader onCancel={handleCancel} text={title} />
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>{description}</DialogContentText>
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
