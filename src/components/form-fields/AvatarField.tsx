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
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { ACCEPTED_AVATAR_FILES, MAX_AVATAR_WIDTH_HEIGHT, MAX_IMAGE_FILE_SIZE } from 'utils';

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

  const dialogHeaderProps = useMemo(
    () => ({
      text: t('edit-profile:avatar'),
      emoji: '🤳',
      onClose: handleCloseDialog,
    }),
    [handleCloseDialog, t],
  );

  const setAvatar = useCallback(
    (file: File | null): void => {
      setFieldValue('avatar', file);
      handleCloseDialog();

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = (): void => {
          setPreview(String(reader.result));
        };
      } else {
        setPreview('');
      }
    },
    [handleCloseDialog, setFieldValue],
  );

  // Automatically resize the image and update the field value.
  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = R.pathOr<File | null>(null, ['currentTarget', 'files', '0'], e);

      const options = {
        maxSizeMB: MAX_IMAGE_FILE_SIZE / 1000000,
        maxWidthOrHeight: MAX_AVATAR_WIDTH_HEIGHT,
      };

      if (file?.size && file.size > MAX_IMAGE_FILE_SIZE) {
        try {
          const compressedFile = await imageCompression(file, options);
          setAvatar(compressedFile);
        } catch {
          toggleNotification(t('validation:fileSizeError'));
        }
      } else {
        setAvatar(file);
      }
    },
    [setAvatar, t, toggleNotification],
  );

  const handleRemoveAvatar = useCallback((): void => {
    setFieldValue('avatar', null);
    setPreview('');
    handleCloseDialog();
  }, [handleCloseDialog, setFieldValue]);

  const addOrChangeAvatarText = preview
    ? t('edit-profile:changeAvatar')
    : t('edit-profile:addAvatar');

  const renderAddOrChangeAvatarIcon = useMemo(
    () => (preview ? <EditOutlined /> : <AddCircleOutlineOutlined />),
    [preview],
  );

  const renderAddOrChangeAvatar = useMemo(
    () => (
      <label htmlFor="avatar-input">
        <MenuItem>
          <ListItemIcon>{renderAddOrChangeAvatarIcon}</ListItemIcon>
          <ListItemText>{addOrChangeAvatarText}</ListItemText>
        </MenuItem>
      </label>
    ),
    [addOrChangeAvatarText, renderAddOrChangeAvatarIcon],
  );

  const renderRemoveAvatar = useMemo(
    () => (
      <MenuItem onClick={handleRemoveAvatar} disabled={!preview}>
        <ListItemIcon>
          <DeleteForeverOutlined />
        </ListItemIcon>
        <ListItemText>{t('edit-profile:clearAvatar')}</ListItemText>
      </MenuItem>
    ),
    [handleRemoveAvatar, preview, t],
  );

  const renderPreview = useMemo(
    () => (
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
          {addOrChangeAvatarText}
        </Button>
      </Box>
    ),
    [
      classes.avatar,
      classes.button,
      handleAvatarChange,
      handleOpenDialog,
      preview,
      addOrChangeAvatarText,
    ],
  );

  const renderErrorMessage = useMemo(
    () => (
      <ErrorMessage className={classes.errorMessage} name="avatar" component={FormErrorMessage} />
    ),
    [classes.errorMessage],
  );

  const renderDialog = useMemo(
    () => (
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
    ),
    [dialogHeaderProps, dialogOpen, handleCloseDialog, renderAddOrChangeAvatar, renderRemoveAvatar],
  );

  return (
    <FormControl>
      {renderPreview}
      {renderErrorMessage}
      {renderDialog}
    </FormControl>
  );
};
