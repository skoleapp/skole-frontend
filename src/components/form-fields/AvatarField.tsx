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
import { ErrorMessage, FormikProps, FormikValues } from 'formik';
import { useOpen } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { ACCEPTED_AVATAR_FILES, MAX_AVATAR_FILE_SIZE, MAX_AVATAR_WIDTH_HEIGHT } from 'utils';
import imageCompression from 'browser-image-compression';
import { useNotificationsContext } from 'context';
import { ResponsiveDialog } from '../shared';
import { FormErrorMessage } from './FormErrorMessage';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  avatar: {
    width: '5rem',
    height: '5rem',
    [breakpoints.up('md')]: {
      width: '7rem',
      height: '7rem',
    },
  },
  button: {
    marginTop: spacing(4),
  },
  errorMessage: {
    textAlign: 'center',
  },
}));

export const AvatarField = <T extends FormikValues>({
  setFieldValue,
  values,
}: FormikProps<T>): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const [preview, setPreview] = useState(values.avatar);

  const {
    open: dialogOpen,
    handleOpen: handleOpenDialog,
    handleClose: handleCloseDialog,
  } = useOpen();

  const dialogHeaderProps = {
    text: t('edit-profile:avatar'),
    onCancel: handleCloseDialog,
  };

  const setAvatar = (file: File | Blob) => {
    setFieldValue('avatar', file);
    handleCloseDialog();

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (): void => {
      setPreview(String(reader.result));
    };
  };

  // Automatically resize the image and update the field value.
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File = R.path(['currentTarget', 'files', '0'], e);

    const options = {
      maxSizeMB: MAX_AVATAR_FILE_SIZE / 1000000,
      maxWidthOrHeight: MAX_AVATAR_WIDTH_HEIGHT,
    };

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      try {
        const compressedFile = await imageCompression(file, options);
        setAvatar(compressedFile);
      } catch {
        toggleNotification(t('validation:fileSizeError'));
      }
    } else {
      setAvatar(file);
    }
  };

  const handleRemoveAvatar = (): void => {
    setFieldValue('avatar', null);
    setPreview('');
    handleCloseDialog();
  };

  const addOrChangeAvatarText = preview
    ? t('edit-profile:changeAvatar')
    : t('edit-profile:addAvatar');

  const renderAddOrChangeAvatarIcon = preview ? <EditOutlined /> : <AddCircleOutlineOutlined />;

  const renderAddOrChangeAvatar = (
    <label htmlFor="avatar-input">
      <MenuItem>
        <ListItemIcon>{renderAddOrChangeAvatarIcon}</ListItemIcon>
        <ListItemText>{addOrChangeAvatarText}</ListItemText>
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

  const renderPreview = (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar className={classes.avatar} src={preview} />
      <input
        value=""
        id="avatar-input"
        type="file"
        accept={ACCEPTED_AVATAR_FILES.toString()}
        capture="user" // User-facing camera.
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

  const renderErrorMessage = (
    <ErrorMessage className={classes.errorMessage} name="avatar" component={FormErrorMessage} />
  );

  const renderDialog = (
    <ResponsiveDialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      dialogHeaderProps={dialogHeaderProps}
    >
      <List>
        {renderAddOrChangeAvatar}
        {renderRemoveAvatar}
      </List>
    </ResponsiveDialog>
  );

  return (
    <FormControl>
      {renderPreview}
      {renderErrorMessage}
      {renderDialog}
    </FormControl>
  );
};
