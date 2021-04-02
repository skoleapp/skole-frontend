import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextFieldProps } from '@material-ui/core/TextField';
import VisibilityOffOutlined from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityOutlined from '@material-ui/icons/VisibilityOutlined';
import { Field, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import React, { useCallback, useMemo, useState } from 'react';

import { TextFormField } from './TextFormField';

export const PasswordField = <T extends FormikValues>(
  props: FormikProps<T> & TextFieldProps,
): JSX.Element => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = useCallback((): void => setShowPassword(!showPassword), [
    showPassword,
  ]);

  const inputProps = useMemo(
    () => ({
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleClickShowPassword} tabIndex="-1">
            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
          </IconButton>
        </InputAdornment>
      ),
    }),
    [handleClickShowPassword, showPassword],
  );

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
