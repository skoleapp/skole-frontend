import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage } from '.';
import { Subject } from '../interfaces';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SubjectField: React.FC<FormikProps<any>> = ({ values }) => (
  <FormControl fullWidth>
    <InputLabel>Subject</InputLabel>
    <Field name="subjectId" component={Select} fullWidth>
      <MenuItem value="">---</MenuItem>
      {values.subjects &&
        values.subjects.map(
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
