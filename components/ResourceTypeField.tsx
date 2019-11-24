import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage } from '.';

// TODO: Get resource types from backend.
// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const ResourceTypeField: React.FC<FormikProps<any>> = () => (
  <FormControl fullWidth>
    <InputLabel>Resource Type</InputLabel>
    <Field name="resourceType" component={Select}>
      <MenuItem value="">---</MenuItem>
      <MenuItem value="Exam">Exam</MenuItem>
      <MenuItem value="Note">Note</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Field>
    <ErrorMessage name="resourceType" component={FormErrorMessage} />
  </FormControl>
);
