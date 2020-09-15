import {
    Avatar,
    Box,
    Button,
    Drawer,
    FormControl,
    List,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
} from '@material-ui/core';
import { ClearOutlined, EditOutlined, LibraryAddOutlined } from '@material-ui/icons';
import { useNotificationsContext } from 'context';
import { FormikProps } from 'formik';
import { useDrawer } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { UpdateProfileFormValues } from 'types';
import { AVATAR_MAX_FILE_SIZE as maxFileSize } from 'utils';

const useStyles = makeStyles(({ spacing }) => ({
    button: {
        marginTop: spacing(2),
    },
}));

export const AvatarField: React.FC<FormikProps<UpdateProfileFormValues>> = ({ setFieldValue, values }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [preview, setPreview] = useState(values.avatar);
    const { toggleNotification } = useNotificationsContext();

    const { renderHeader: renderDrawerHeader, handleOpen: handleOpenDrawer, ...drawerProps } = useDrawer(
        t('edit-profile:avatar'),
    );

    const { onClose: handleCloseDrawer } = drawerProps;

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const avatar = R.path(['currentTarget', 'files', '0'], e) as File;

        if (avatar.size > maxFileSize) {
            toggleNotification(t('validation:fileSizeError'));
        } else {
            reader.readAsDataURL(avatar);
            reader.onloadend = (): void => {
                setFieldValue('avatar', avatar);
                setPreview(reader.result as string);
                handleCloseDrawer(e);
            };
        }
    };

    const handleRemoveAvatar = (e: SyntheticEvent): void => {
        setFieldValue('avatar', null);
        setPreview('');
        handleCloseDrawer(e);
    };

    const renderAddAvatar = !preview && (
        <label htmlFor="avatar-input">
            <MenuItem>
                <ListItemIcon>
                    <LibraryAddOutlined />
                </ListItemIcon>
                <ListItemText>{t('edit-profile:addAvatar')}</ListItemText>
            </MenuItem>
        </label>
    );

    const renderChangeAvatar = !!preview && (
        <label htmlFor="avatar-input">
            <MenuItem>
                <ListItemIcon>
                    <EditOutlined />
                </ListItemIcon>
                <ListItemText>{t('edit-profile:changeAvatar')}</ListItemText>
            </MenuItem>
        </label>
    );

    const renderRemoveAvatar = !!preview && (
        <MenuItem onClick={handleRemoveAvatar}>
            <ListItemIcon>
                <ClearOutlined />
            </ListItemIcon>
            <ListItemText>{t('edit-profile:clearAvatar')}</ListItemText>
        </MenuItem>
    );

    const renderPreview = (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar className="main-avatar" src={preview} />
            <input
                value=""
                id="avatar-input"
                type="file"
                accept=".png, .jpg, .jpeg;capture=camera"
                onChange={handleAvatarChange}
            />
            <Button
                className={classes.button}
                onClick={handleOpenDrawer}
                variant="text"
                color="primary"
                component="span"
            >
                {t('edit-profile:changeAvatar')}
            </Button>
        </Box>
    );

    const renderDrawerList = (
        <List>
            {renderAddAvatar}
            {renderChangeAvatar}
            {renderRemoveAvatar}
        </List>
    );

    const renderDrawer = (
        <Drawer {...drawerProps}>
            {renderDrawerHeader}
            {renderDrawerList}
        </Drawer>
    );

    return (
        <FormControl>
            {renderPreview}
            {renderDrawer}
        </FormControl>
    );
};
