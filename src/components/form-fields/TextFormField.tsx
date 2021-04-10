import FormControl from '@material-ui/core/FormControl';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
  field: FieldAttributes<TextFieldProps>;
  form: FormikProps<FormikValues>;
}

// A wrapper around MUI's `TextField` to allow it's usage directly as form field components.
// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TextFormField: React.FC<Props> = ({ field, form, ...props }) => (
  <FormControl>
    <TextField {...field} {...props} InputLabelProps={{ shrink: !!field.value }} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </FormControl>
);
