import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
  field: FieldAttributes<FormControlLabelProps>;
  form: FormikProps<FormikValues>;
}

// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CheckboxFormField: React.FC<Props> = ({ field, form, ...props }) => (
  <FormControl>
    <FormControlLabel {...field} {...props} control={<Checkbox checked={!!field.value} />} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </FormControl>
);
