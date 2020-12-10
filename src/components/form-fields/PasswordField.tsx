import { IconButton, InputAdornment, TextFieldProps } from '@material-ui/core';
import { VisibilityOffOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Field, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import React, { useState } from 'react';

import { TextFormField } from './TextFormField';

export const PasswordField = <T extends FormikValues>(
  props: FormikProps<T> & TextFieldProps,
): JSX.Element => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = (): void => setShowPassword(!showPassword);

  const inputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={handleClickShowPassword} tabIndex="-1">
          {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <Field
      name="password"
      label={t('forms:password')}
      type={showPassword ? 'text' : 'password'}
      component={TextFormField}
      InputProps={inputProps}
      {...props}
    />
  );
};
