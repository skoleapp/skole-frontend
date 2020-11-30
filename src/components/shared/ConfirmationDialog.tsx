import { useTranslation } from 'lib';
import React from 'react';
import { Button, DialogActions, DialogContentText, DialogContent } from '@material-ui/core';
import { useConfirmContext } from 'context';
import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

export const ConfirmationDialog: React.FC = () => {
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
        <DialogContentText>{description}</DialogContentText>
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
