import { Avatar, Box, Button, FormControl } from '@material-ui/core';
import { ClearOutlined, EditOutlined } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { UpdateProfileFormValues } from '../../pages/account/edit-profile';
import { mediaURL } from '../../utils';
import { FormErrorMessage } from './FormErrorMessage';

export const AvatarField: React.FC<FormikProps<UpdateProfileFormValues>> = ({
    setFieldValue,
    setFieldError,
    values,
}) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(mediaURL(values.avatar));

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const avatar = R.path(['currentTarget', 'files', '0'], e) as File;
        if (avatar.size > 2000000) {
            setFieldError('avatar', t('forms:fileSizeErr'));
        } else {
            reader.readAsDataURL(avatar);
            reader.onloadend = (): void => {
                setFieldValue('avatar', avatar);
                setPreview(reader.result as string);
            };
        }
    };

    const handleRemoveImage = (): void => {
        setFieldValue('avatar', null);
        setPreview('');
    };

    return (
        <StyledImagePreviewField fullWidth>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar className="main-avatar" src={preview} />
                <Box width="12rem">
                    <input
                        value=""
                        id="avatar-input"
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        capture="camera"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-input">
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            endIcon={<EditOutlined />}
                            fullWidth
                        >
                            {t('edit-profile:changeAvatar')}
                        </Button>
                    </label>
                    {!!preview && (
                        <Box marginTop="0.5rem">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleRemoveImage}
                                endIcon={<ClearOutlined />}
                                fullWidth
                            >
                                {t('edit-profile:clearAvatar')}
                            </Button>
                        </Box>
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
