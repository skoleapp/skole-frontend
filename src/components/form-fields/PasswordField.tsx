import { IconButton, InputAdornment } from '@material-ui/core';
import { VisibilityOffOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { useTranslation } from 'lib';
import { useState } from 'react';
import React from 'react';

export const PasswordField: React.FC<FormikProps<{}>> = props => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = (): void => setShowPassword(!showPassword);

    return (
        <Field
            {...props}
            name="password"
            label={t('forms:password')}
            placeholder={t('forms:password')}
            type={showPassword ? 'text' : 'password'}
            component={TextField}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
