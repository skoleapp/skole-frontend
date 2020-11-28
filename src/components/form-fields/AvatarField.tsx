import {
  Avatar,
  Box,
  Button,
  FormControl,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
} from '@material-ui/core';
import { AddCircleOutlineOutlined, ClearOutlined, EditOutlined } from '@material-ui/icons';
import { useNotificationsContext } from 'context';
import { FormikProps, FormikValues } from 'formik';
import { useOpen } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { ACCEPTED_AVATAR_FILES, AVATAR_MAX_FILE_SIZE as maxFileSize } from 'utils';

import { ResponsiveDialog } from '../shared';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  button: {
    marginTop: spacing(2),
  },
  avatar: {
    width: '5rem',
    height: '5rem',
    [breakpoints.up('md')]: {
      width: '7rem',
      height: '7rem',
    },
  },
}));

export const AvatarField = <T extends FormikValues>({
  setFieldValue,
  values,
}: FormikProps<T>): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [preview, setPreview] = useState(values.avatar);
  const { toggleNotification } = useNotificationsContext();

  const {
    open: dialogOpen,
    handleOpen: handleOpenDialog,
    handleClose: handleCloseDialog,
  } = useOpen();

  const dialogHeaderProps = {
    text: t('edit-profile:avatar'),
    onCancel: handleCloseDialog,
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const reader = new FileReader();
    const avatar = R.path(['currentTarget', 'files', '0'], e) as File;

    if (avatar.size > maxFileSize) {
      toggleNotification(t('validation:fileSizeError'));
    } else {
      reader.readAsDataURL(avatar);
      reader.onloadend = (): void => {
        setFieldValue('avatar', avatar);
        setPreview(String(reader.result));
        handleCloseDialog();
      };
    }
  };

  const handleRemoveAvatar = (): void => {
    setFieldValue('avatar', null);
    setPreview('');
    handleCloseDialog();
  };

  const renderChangeAvatar = (
    <label htmlFor="avatar-input">
      <MenuItem disabled={!preview}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText>{t('edit-profile:changeAvatar')}</ListItemText>
      </MenuItem>
    </label>
  );

  const renderRemoveAvatar = (
    <MenuItem onClick={handleRemoveAvatar} disabled={!preview}>
      <ListItemIcon>
        <ClearOutlined />
      </ListItemIcon>
      <ListItemText>{t('edit-profile:clearAvatar')}</ListItemText>
    </MenuItem>
  );

  const renderAddAvatar = (
    <label htmlFor="avatar-input">
      <MenuItem disabled={!!preview}>
        <ListItemIcon>
          <AddCircleOutlineOutlined />
        </ListItemIcon>
        <ListItemText>{t('edit-profile:addAvatar')}</ListItemText>
      </MenuItem>
    </label>
  );

  const renderPreview = (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar className={classes.avatar} src={preview} />
      <input
        value=""
        id="avatar-input"
        type="file"
        accept={`${ACCEPTED_AVATAR_FILES.toString};capture=camera`}
        onChange={handleAvatarChange}
      />
      <Button
        className={classes.button}
        onClick={handleOpenDialog}
        variant="text"
        color="primary"
        component="span"
      >
        {t('edit-profile:changeAvatar')}
      </Button>
    </Box>
  );

  const renderDialog = (
    <ResponsiveDialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      dialogHeaderProps={dialogHeaderProps}
    >
      <List>
        {renderChangeAvatar}
        {renderRemoveAvatar}
        {renderAddAvatar}
      </List>
    </ResponsiveDialog>
  );

  return (
    <FormControl>
      {renderPreview}
      {renderDialog}
    </FormControl>
  );
};
