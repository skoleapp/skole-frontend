import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select, { SelectProps } from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import * as R from 'ramda';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

// The form control wrapper has different margins for this select field than for all other fields.
// We manually override the margins to match the other form field margins.
const useStyles = makeStyles({
  root: {
    marginTop: '16px',
    marginBottom: '8px',
  },
});

interface Props {
  field: FieldAttributes<SelectProps>;
  form: FormikProps<FormikValues>;
  label: string;
}

// We must use duplicate labels for the following reason:
// One label for telling the outlined field to leave space for the label and the other once for actually showing the label.
// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NativeSelectField: React.FC<Props> = ({ field, label, children, ...props }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.root}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} native {...field} {...R.omit(['form'], props)}>
        {children}
      </Select>
      <ErrorMessage name={field.name} component={FormErrorMessage} />
    </FormControl>
  );
};
