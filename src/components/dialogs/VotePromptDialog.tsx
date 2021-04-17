import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import { useVoteContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

const useStyles = makeStyles({
  dialogContentText: {
    textAlign: 'center',
  },
});

export const VotePromptDialog: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { votePromptOpen, handleCloseVotePrompt } = useVoteContext();

  return (
    <SkoleDialog open={votePromptOpen} fullScreen={false}>
      <DialogHeader
        onClose={handleCloseVotePrompt}
        text={t('common:votePromptDialogHeader')}
        emoji="🙊"
      />
      <DialogContent>
        <DialogContentText className={classes.dialogContentText} color="textPrimary">
          {t('common:votePromptDialogText')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseVotePrompt} fullWidth>
          {t('common:gotIt')}
        </Button>
      </DialogActions>
    </SkoleDialog>
  );
};
