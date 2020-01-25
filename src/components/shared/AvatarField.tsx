import { Avatar, Box, Button, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { FormErrorMessage } from '.';
import { useTranslation } from 'react-i18next';
import { UpdateProfileFormValues } from '../../pages/account/edit-profile';

// FIXME: I am borke.
export const AvatarField: React.FC<FormikProps<UpdateProfileFormValues>> = ({ setFieldValue, values }) => {
    const { t } = useTranslation();
    const [avatar, setAvatar] = useState();
    const [preview, setPreview] = useState();

    useEffect(() => {
        const objectUrl = avatar && URL.createObjectURL(avatar);
        setPreview(objectUrl);
        return (): void => URL.revokeObjectURL(objectUrl);
    }, [avatar]);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const newAvatar = R.path(['currentTarget', 'files', '0'], e) as File;
        setFieldValue('avatar', newAvatar);
        setAvatar(newAvatar);
    };

    return (
        <StyledImagePreviewField fullWidth>
            <Box display="flex" flexDirection="column" alignItems="center" marginY="0.5rem">
                <Avatar className="main-avatar" src={avatar ? preview : process.env.BACKEND_URL + values.avatar} />
                <Field
                    value=""
                    name="avatar"
                    id="avatar-input"
                    accept="image/*"
                    type="file"
                    component="input"
                    onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-input">
                    <Button variant="outlined" color="primary" component="span">
                        {t('edit-profile:changeAvatarButton')}
                    </Button>
                </label>
                <ErrorMessage name="avatar" component={FormErrorMessage} />
            </Box>
        </StyledImagePreviewField>
    );
};

const StyledImagePreviewField = styled(FormControl)`
    label {
        width: 100%;
    }

    input {
        display: none;
    }

    .MuiButton-root {
        margin-top: 0;
    }
`;
