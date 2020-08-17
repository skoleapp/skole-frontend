import { Avatar, Box, Button, FormControl, ListItemText, MenuItem } from '@material-ui/core';
import { ClearOutlined, EditOutlined, LibraryAddOutlined } from '@material-ui/icons';
import { useNotificationsContext } from 'context';
import { ErrorMessage, FormikProps } from 'formik';
import { useDrawer } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import styled from 'styled-components';
import { UpdateProfileFormValues } from 'types';

import { StyledDrawer, StyledList } from '..';

export const AvatarField: React.FC<FormikProps<UpdateProfileFormValues>> = ({ setFieldValue, values }) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(values.avatar);
    const { toggleNotification } = useNotificationsContext();
    const { renderHeader, handleOpen, ...drawerProps } = useDrawer(t('edit-profile:avatar'));
    const { onClose: handleCloseDrawer } = drawerProps;

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const avatar = R.path(['currentTarget', 'files', '0'], e) as File;

        if (avatar.size > 2000000) {
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
                <ListItemText>
                    <LibraryAddOutlined /> {t('edit-profile:addAvatar')}
                </ListItemText>
            </MenuItem>
        </label>
    );

    const renderChangeAvatar = !!preview && (
        <label htmlFor="avatar-input">
            <MenuItem>
                <ListItemText>
                    <EditOutlined /> {t('edit-profile:changeAvatar')}
                </ListItemText>
            </MenuItem>
        </label>
    );

    const renderRemoveAvatar = !!preview && (
        <MenuItem onClick={handleRemoveAvatar}>
            <ListItemText>
                <ClearOutlined /> {t('edit-profile:clearAvatar')}
            </ListItemText>
        </MenuItem>
    );

    return (
        <StyledAvatarField fullWidth>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar className="main-avatar" src={preview} />
                <Box width="12rem">
                    <input
                        value=""
                        id="avatar-input"
                        type="file"
                        accept=".png, .jpg, .jpeg;capture=camera"
                        onChange={handleAvatarChange}
                    />
                    <Button
                        id="change-avatar-button"
                        onClick={handleOpen}
                        variant="text"
                        color="primary"
                        component="span"
                    >
                        {t('edit-profile:changeAvatar')}
                    </Button>
                </Box>
            </Box>
            <StyledDrawer {...drawerProps}>
                {renderHeader}
                <StyledList>
                    {renderAddAvatar}
                    {renderChangeAvatar}
                    {renderRemoveAvatar}
                </StyledList>
            </StyledDrawer>
        </StyledAvatarField>
    );
};

const StyledAvatarField = styled(FormControl)`
    #change-avatar-button {
        margin-top: 0.5rem;
    }
`;
