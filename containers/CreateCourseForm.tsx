import { MenuItem } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { StyledForm } from '../components';
import { CreateCourseFormValues, School, Subject } from '../interfaces';

interface Props extends FormikProps<CreateCourseFormValues> {
  subjects: Subject[];
  schools: School[];
}

export const CreateCourseForm: React.FC<Props> = ({ subjects, schools }) => (
  <StyledForm>
    <Field
      name="name"
      placeholder="Course Name"
      label="Course Name"
      component={TextField}
      fullWidth
    />
    <Field
      name="code"
      placeholder="Course Code"
      label="Course Code"
      component={TextField}
      fullWidth
    />
    <Field name="subject" placeholder="Subject" label="Subject" component={Select} fullWidth>
      {console.log(subjects)}
      {subjects &&
        subjects.map(
          (s: Subject, i: number): JSX.Element => (
            <MenuItem key={i} value={s.id}>
              {s.name}
            </MenuItem>
          )
        )}
    </Field>
    <Field name="school" placeholder="School" label="School" component={Select} fullWidth>
      {schools &&
        schools.map(
          (s: School, i: number): JSX.Element => (
            <MenuItem key={i} value={s.id}>
              {s.name}
            </MenuItem>
          )
        )}
    </Field>
    <Field />
  </StyledForm>
);
