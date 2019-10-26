import { TextField } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';

export const TextFormField: React.FC<FieldProps> = ({ field, form, ...props }) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <TextField
      fullWidth
      margin="normal"
      helperText={errorText}
      error={!!errorText}
      {...field}
      {...props}
    />
  );
};
