import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import { useAuthContext, useNotificationsContext, useShareContext } from 'context';
import { useTranslation } from 'lib';
import React, { useCallback, useMemo } from 'react';
import { useMediaQueries } from 'styles';
import { SLOGAN } from 'utils';

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
  open: boolean;
  header?: JSX.Element | string;
  dynamicContent: JSX.Element[];
  handleClose: () => void;
  hideInviteCode?: boolean;
  handleClickInviteButton?: () => void;
}

export const CustomInviteDialog: React.FC<Props> = ({
  open,
  header,
  dynamicContent,
  handleClose,
  hideInviteCode,
  handleClickInviteButton: _handleClickInviteButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { inviteCode } = useAuthContext();
  const { mdUp } = useMediaQueries();
  const { handleOpenShareDialog } = useShareContext();
  const { toggleNotification } = useNotificationsContext();
  const { username } = useAuthContext();
  const title = t('common:inviteTitle', { username });
  const text = SLOGAN;
  const customLink = `${process.env.FRONTEND_URL}?code=${inviteCode}`;

  const shareDialogParams = useMemo(
    () => ({
      header: t('common:inviteShareDialogHeader'),
      title,
      text,
      customLink,
    }),
    [t, text, title, customLink],
  );

  const handleClickInviteButton = useCallback(async (): Promise<void> => {
    if (mdUp) {
      handleClose();
      handleOpenShareDialog(shareDialogParams);
    } else {
      const { navigator } = window;

      if (navigator?.share) {
        try {
          await navigator.share({
            title,
            text,
            url: customLink,
          });
        } catch {
          // User cancelled.
        }
      }
    }
  }, [handleOpenShareDialog, mdUp, handleClose, shareDialogParams, customLink, text, title]);

  const handleClickCopyCodeButton = useCallback((): void => {
    toggleNotification(t('common:inviteCodeCopied'));
    navigator.clipboard.writeText(customLink);
  }, [customLink, t, toggleNotification]);

  const renderInviteCodeText = useMemo(
    () =>
      !hideInviteCode && (
        <DialogContentText>
          <Typography variant="body2">{t('common:inviteDialogCodeText')}</Typography>
        </DialogContentText>
      ),
    [t, hideInviteCode],
  );

  const renderCopyCodeButton = useMemo(
    () => (
      <IconButton onClick={handleClickCopyCodeButton} className={classes.copyCodeButton}>
        <FileCopyOutlined className={classes.copyCodeButtonIcon} />
      </IconButton>
    ),
    [classes.copyCodeButton, classes.copyCodeButtonIcon, handleClickCopyCodeButton],
  );

  const renderInviteCode = useMemo(
    () =>
      !hideInviteCode && (
        <DialogContentText color="textPrimary">
          <Typography variant="body2">
            {inviteCode} {renderCopyCodeButton}
          </Typography>
        </DialogContentText>
      ),
    [inviteCode, renderCopyCodeButton, hideInviteCode],
  );

  const renderInviteButton = useMemo(
    () => (
      <Button
        variant="contained"
        onClick={_handleClickInviteButton || handleClickInviteButton}
        endIcon={<ArrowForwardOutlined />}
        fullWidth
      >
        {t('common:inviteButtonText')}
      </Button>
    ),
    [handleClickInviteButton, t, _handleClickInviteButton],
  );

  return (
    <SkoleDialog open={open} fullScreen={false}>
      <DialogHeader text={header} onClose={handleClose} />
      <DialogContent>
        {dynamicContent.map((d) => d)}
        {renderInviteCodeText}
        {renderInviteCode}
      </DialogContent>
      <DialogActions>{renderInviteButton}</DialogActions>
    </SkoleDialog>
  );
};
