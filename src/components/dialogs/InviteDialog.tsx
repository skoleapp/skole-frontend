import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import { useAuthContext, useInviteContext, useNotificationsContext } from 'context';
import { useTranslation } from 'lib';
import React, { useCallback, useMemo } from 'react';
import { SLOGAN, urls } from 'utils';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

const useStyles = makeStyles(({ spacing }) => ({
  copyCodeButton: {
    padding: spacing(0.75),
    marginLeft: spacing(1),
  },
  copyCodeButtonIcon: {
    width: '1rem',
    height: '1rem',
  },
}));

interface Props {
  header?: string;
  dynamicContent: JSX.Element[];
  handleCloseCallback?: () => void;
}

export const InviteDialog: React.FC<Props> = ({ header, dynamicContent, handleCloseCallback }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { inviteCode } = useAuthContext();

  const {
    inviteDialogOpen,
    handleCloseInviteDialog: _handleCloseInvitePrompt,
  } = useInviteContext();

  const handleClose = (): void => {
    _handleCloseInvitePrompt();

    if (handleCloseCallback) {
      handleCloseCallback();
    }
  };

  const handleClickInviteButton = useCallback(async (): Promise<void> => {
    const { navigator } = window;

    if (!!navigator && !!navigator.share) {
      try {
        await navigator.share({
          title: t('common:inviteTitle'),
          text: SLOGAN,
          url: `${urls.index}?code=${inviteCode}`,
        });
      } catch {
        // User cancelled.
      }
    }
  }, [t, inviteCode]);

  const handleClickCopyCodeButton = useCallback((): void => {
    toggleNotification(t('common:inviteCodeCopied'));
    navigator.clipboard.writeText(inviteCode);
  }, [inviteCode, t, toggleNotification]);

  const renderCopyCodeButton = useMemo(
    () => (
      <IconButton onClick={handleClickCopyCodeButton} className={classes.copyCodeButton}>
        <FileCopyOutlined className={classes.copyCodeButtonIcon} />
      </IconButton>
    ),
    [classes.copyCodeButton, classes.copyCodeButtonIcon, handleClickCopyCodeButton],
  );

  return (
    <SkoleDialog open={inviteDialogOpen} fullScreen={false}>
      <DialogHeader text={header} onCancel={handleClose} />
      <DialogContent>
        {dynamicContent.map((d) => d)}
        <DialogContentText>
          <Typography variant="body2">{t('common:inviteCodeText')}</Typography>
        </DialogContentText>
        <DialogContentText color="textPrimary">
          <Typography variant="body2">
            {inviteCode} {renderCopyCodeButton}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleClickInviteButton}
          endIcon={<ArrowForwardOutlined />}
          fullWidth
        >
          {t('common:inviteButtonText')}
        </Button>
      </DialogActions>
    </SkoleDialog>
  );
};
