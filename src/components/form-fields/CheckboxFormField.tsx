import Checkbox from '@material-ui/core/Checkbox';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorMessage, FieldAttributes, FormikProps, FormikValues } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

const useStyles = makeStyles({
  root: {
    // Use consistent margins with other form helper texts.
    marginLeft: '14px',
    marginRight: '14px',
  },
});

interface Props {
  field: FieldAttributes<FormControlLabelProps>;
  form: FormikProps<FormikValues>;
  formControlProps?: FormControlProps;
}

// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CheckboxFormField: React.FC<Props> = ({ field, form, formControlProps, ...props }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.root} {...formControlProps}>
      <FormControlLabel {...field} {...props} control={<Checkbox checked={!!field.value} />} />
      <ErrorMessage name={field.name} component={FormErrorMessage} />
    </FormControl>
  );
};
