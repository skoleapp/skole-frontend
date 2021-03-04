import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import imageCompression from 'browser-image-compression';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FormikProps, FormikValues } from 'formik';
import { useOpen } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { ACCEPTED_AVATAR_FILES, MAX_AVATAR_FILE_SIZE, MAX_AVATAR_WIDTH_HEIGHT } from 'utils';

import { ResponsiveDialog } from '../dialogs';
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
    emoji: '🤳',
    onCancel: handleCloseDialog,
  };

  const setAvatar = (file: File | Blob): void => {
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
        <DeleteForeverOutlined />
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
        onChange={handleAvatarChange}
      />
      <Button className={classes.button} onClick={handleOpenDialog} variant="text">
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
      list
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
