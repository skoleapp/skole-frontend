import { Avatar, Box, Button, FormControl, IconButton } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { UpdateProfileFormValues } from '../../pages/account/edit-profile';
import { mediaURL } from '../../utils/mediaURL';
import { FormErrorMessage } from '.';

export const AvatarField: React.FC<FormikProps<UpdateProfileFormValues>> = ({ setFieldValue, values }) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(mediaURL(values.avatar));

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const avatar = R.path(['currentTarget', 'files', '0'], e) as File;
        setFieldValue('avatar', avatar);
        reader.readAsDataURL(avatar);

        reader.onloadend = (): void => {
            setFieldValue('avatar', avatar);
            setPreview(reader.result as string);
        };
    };

    const handleRemoveImage = (): void => {
        setFieldValue('avatar', null);
        setPreview('');
    };

    return (
        <StyledImagePreviewField fullWidth>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar className="main-avatar" src={preview} />
                <input value="" id="avatar-input" accept="image/*" type="file" onChange={handleAvatarChange} />
                <Box marginY="0.5rem" display="flex" alignItems="center">
                    <label htmlFor="avatar-input">
                        <Button variant="outlined" color="primary" component="span">
                            {t('edit-profile:changeAvatarButton')}
                        </Button>
                    </label>
                    {!!preview && (
                        <IconButton onClick={handleRemoveImage} color="primary">
                            <DeleteOutline />
                        </IconButton>
                    )}
                </Box>
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

    .MuiIconButton-root {
        margin-left: 0.5rem;
    }
`;
