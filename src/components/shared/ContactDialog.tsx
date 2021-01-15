import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useTranslation } from 'lib';
import React from 'react';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

interface Props {
  header: string;
  text: JSX.Element | string;
  open: boolean;
  handleClose: () => void;
}

export const ContactDialog: React.FC<Props> = ({ header, text, open, handleClose }) => {
  const { t } = useTranslation();

  return (
    <SkoleDialog open={open} fullScreen={false}>
      <DialogHeader onCancel={handleClose} text={header} />
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose} fullWidth>
          {t('common:gotIt')}
        </Button>
      </DialogActions>
    </SkoleDialog>
  );
};
