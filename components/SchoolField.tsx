import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { School } from '../interfaces';
import { FormErrorMessage } from './FormErrorMessage';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SchoolField: React.FC<FormikProps<any>> = props => (
  <FormControl fullWidth>
    <InputLabel>School</InputLabel>
    <Field name="schoolId" component={Select} placeholder="test" fullWidth>
      <MenuItem value="">---</MenuItem>
      {props.values.schools &&
        props.values.schools.map(
          (s: School, i: number): JSX.Element => (
            <MenuItem key={i} value={s.id}>
              {s.name}
            </MenuItem>
          )
        )}
    </Field>
    <ErrorMessage name="schoolId" component={FormErrorMessage} />
  </FormControl>
);
