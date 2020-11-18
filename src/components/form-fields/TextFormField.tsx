import { TextField, TextFieldProps } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
  field: FieldAttributes<TextFieldProps>;
  form: FormikProps<Record<symbol, unknown>>;
}

// A wrapper around MUI's `TextField` to allow it's usage directly as form field components.
// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TextFormField: React.FC<Props> = ({ field, form, ...props }) => (
  <>
    <TextField {...field} {...props} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </>
);
