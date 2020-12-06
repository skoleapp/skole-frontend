import {
  Avatar,
  Grid,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { DeviceUnknownOutlined, KeyboardArrowDown } from '@material-ui/icons';
import { useAuthContext } from 'context';
import { FormikProps } from 'formik';
import { useOpen } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { CreateCommentFormValues } from 'types';
import { mediaUrl } from 'utils';
import * as R from 'ramda';
import { ResponsiveDialog } from '../shared';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
  },
});

export const AuthorSelection: React.FC<FormikProps<CreateCommentFormValues>> = ({
  values: { user },
  setFieldValue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const username = R.prop('username', userMe);

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
        {user ? t('common:postWithAccount') : t('common:postAsAnonymous')} <KeyboardArrowDown />
      </Grid>
    </Typography>
  );

  const authorSelectionDialogHeaderProps = {
    text: t('common:selectAuthor'),
    onCancel: handleCloseAuthorSelection,
  };

  const renderAuthenticatedMenuItem = (
    <MenuItem onClick={handleAuthenticatedMenuItemClick}>
      <ListItemIcon>
        <Avatar
          className="avatar-thumbnail"
          src={mediaUrl(R.propOr('', 'avatarThumbnail', user))}
        />
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

  const renderAuthorInfo = (
    <Grid onClick={handleOpenAuthorSelection} className={classes.root} container direction="column">
      {renderAuthorName}
      {renderAuthorSelectionText}
    </Grid>
  );

  const renderAuthorSelectionDialog = (
    <ResponsiveDialog
      open={authorSelectionOpen}
      onClose={handleCloseAuthorSelection}
      dialogHeaderProps={authorSelectionDialogHeaderProps}
    >
      <List>
        {renderAuthenticatedMenuItem}
        {renderAnonymousMenuItem}
      </List>
    </ResponsiveDialog>
  );

  return (
    <>
      {renderAuthorInfo}
      {renderAuthorSelectionDialog}
    </>
  );
};
