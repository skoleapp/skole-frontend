import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { Subject } from '../interfaces';
import { FormErrorMessage } from './FormErrorMessage';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SubjectField: React.FC<FormikProps<any>> = props => (
  <FormControl fullWidth>
    <InputLabel>Subject</InputLabel>
    <Field name="subjectId" component={Select} fullWidth>
      <MenuItem value="">---</MenuItem>
      {props.values.subjects &&
        props.values.subjects.map(
          (s: Subject, i: number): JSX.Element => (
            <MenuItem key={i} value={s.id}>
              {s.name}
            </MenuItem>
          )
        )}
    </Field>
    <ErrorMessage name="subjectId" component={FormErrorMessage} />
  </FormControl>
);
