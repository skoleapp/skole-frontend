import { useTranslation } from 'next-translate';
import React from 'react';
import { Button, DialogActions, DialogContentText, DialogContent } from '@material-ui/core';
import { ConfirmOptions } from 'types';
import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

interface Props extends ConfirmOptions {
  dialogOpen: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}
export const ConfirmationDialog: React.FC<Props> = ({
  dialogOpen,
  handleCancel,
  handleConfirm,
  title,
  description,
}) => {
  const { t } = useTranslation();

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
