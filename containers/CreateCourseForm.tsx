import { FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage, FormSubmitSection, StyledForm, TextLink } from '../components';
import { CreateCourseFormValues, School, Subject } from '../interfaces';

interface Props extends CreateCourseFormValues {
  subjects?: Subject[];
  schools?: School[];
}

export const CreateCourseForm: React.FC<FormikProps<Props>> = props => (
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
    <FormControl fullWidth>
      <InputLabel>Subject</InputLabel>
      <Field name="subject" component={Select} fullWidth>
        {props.values.subjects &&
          props.values.subjects.map(
            (s: Subject, i: number): JSX.Element => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            )
          )}
      </Field>
      <ErrorMessage name="subject" component={FormErrorMessage} />
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>School</InputLabel>
      <Field name="school" component={Select} fullWidth>
        {props.values.schools &&
          props.values.schools.map(
            (s: School, i: number): JSX.Element => (
              <MenuItem key={i} value={s.id}>
                {s.name}
              </MenuItem>
            )
          )}
      </Field>
      <ErrorMessage name="school" component={FormErrorMessage} />
    </FormControl>
    <FormSubmitSection submitButtonText="save" {...props} />
    <TextLink href="/">Back to Home</TextLink>
  </StyledForm>
);
