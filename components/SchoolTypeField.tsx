import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage } from '.';

// TODO: Get school types from backend.
// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SchoolTypeField: React.FC<FormikProps<any>> = () => (
  <FormControl fullWidth>
    <InputLabel>School Type</InputLabel>
    <Field name="schoolType" placeholder="School Type" component={Select} fullWidth>
      <MenuItem value="">---</MenuItem>
      <MenuItem value="University">University</MenuItem>
      <MenuItem value="University of Applied Sciences">University of Applied Sciences</MenuItem>
      <MenuItem value="High School">High School</MenuItem>
    </Field>
    <ErrorMessage name="schoolType" component={FormErrorMessage} />
  </FormControl>
);
