import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage } from '.';

// TODO: Get courses from backend.
// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const CourseField: React.FC<FormikProps<any>> = () => (
  <FormControl fullWidth>
    <InputLabel>Course</InputLabel>
    <Field name="courseId" component={Select}>
      <MenuItem value="">---</MenuItem>
      <MenuItem value="Test">Test</MenuItem>
      <MenuItem value="Test 2">Test 2</MenuItem>
      <MenuItem value="Test 3">Test 3</MenuItem>
    </Field>
    <ErrorMessage name="courseId" component={FormErrorMessage} />
  </FormControl>
);
