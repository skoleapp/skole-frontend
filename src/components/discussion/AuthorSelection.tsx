import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeviceUnknownOutlined from '@material-ui/icons/DeviceUnknownOutlined';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { useAuthContext } from 'context';
import { FormikProps, FormikValues } from 'formik';
import { useOpen } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { ResponsiveDialog } from '../dialogs';

const useStyles = makeStyles(({ spacing }) => ({
  button: {
    borderRadius: '0.25rem',
    padding: `${spacing(2)} ${spacing(4)}`,
    textTransform: 'none',
    textAlign: 'left',
  },
  avatar: {
    width: '2rem',
    height: '2rem',
  },
}));

export const AuthorSelection = <T extends FormikValues>({
  values: { user },
  setFieldValue,
}: FormikProps<T>): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe, username, avatarThumbnail } = useAuthContext();

  const {
    open: authorSelectionOpen,
    handleOpen: handleOpenAuthorSelection,
    handleClose: handleCloseAuthorSelection,
  } = useOpen();

  const handleAuthenticatedMenuItemClick = () => {
    setFieldValue('user', userMe);
    handleCloseAuthorSelection();
  };

  const handleAnonymousMenuItemClick = () => {
    setFieldValue('user', null);
    handleCloseAuthorSelection();
  };

  const renderAuthorName = user ? (
    <Typography variant="body2" align="left">
      {user.username}
    </Typography>
  ) : (
    <Typography variant="body2" align="left" color="textSecondary">
      {t('common:communityUser')}
    </Typography>
  );

  const renderAuthorSelectionText = (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {user ? t('common:postWithAccount') : t('common:postAsAnonymous')}
      </Grid>
    </Typography>
  );

  const authorSelectionDialogHeaderProps = {
    text: t('common:selectAuthor'),
    emoji: '👤',
    onCancel: handleCloseAuthorSelection,
  };

  const renderAuthenticatedMenuItem = (
    <MenuItem onClick={handleAuthenticatedMenuItemClick}>
      <ListItemIcon>
        <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
      </ListItemIcon>
      <ListItemText>{t('common:postAs', { username })}</ListItemText>
    </MenuItem>
  );

  const renderAnonymousMenuItem = (
    <MenuItem onClick={handleAnonymousMenuItemClick}>
      <ListItemIcon>
        <DeviceUnknownOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:postAsAnonymous')}</ListItemText>
    </MenuItem>
  );

  const renderAvatar = <Avatar className={classes.avatar} src={user ? avatarThumbnail : ''} />;

  const renderAuthorInfo = (
    <Button
      onClick={handleOpenAuthorSelection}
      endIcon={<KeyboardArrowDown color="disabled" />}
      className={classes.button}
      startIcon={renderAvatar}
    >
      <Grid item container direction="column">
        {renderAuthorName}
        {renderAuthorSelectionText}
      </Grid>
    </Button>
  );

  const renderListItems = (
    <List>
      {renderAuthenticatedMenuItem}
      {renderAnonymousMenuItem}
    </List>
  );

  const renderAuthorSelectionDialog = (
    <ResponsiveDialog
      open={authorSelectionOpen}
      onClose={handleCloseAuthorSelection}
      dialogHeaderProps={authorSelectionDialogHeaderProps}
      list
    >
      {renderListItems}
    </ResponsiveDialog>
  );

  return (
    <>
      {renderAuthorInfo}
      {renderAuthorSelectionDialog}
    </>
  );
};
