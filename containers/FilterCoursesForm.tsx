import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, SchoolField, StyledForm, SubjectField } from '../components';
import { FilterCoursesFormValues } from '../interfaces';

export const FilterCoursesForm: React.FC<FormikProps<FilterCoursesFormValues>> = props => (
  <StyledForm>
    <Field
      name="courseName"
      component={TextField}
      label="Course Name"
      placeholder="Course Name"
      fullWidth
    />
    <Field
      name="courseCode"
      component={TextField}
      label="Course Code"
      placeholder="Course Code"
      fullWidth
    />
    <SchoolField {...props} />
    <SubjectField {...props} />
    <FormSubmitSection submitButtonText="apply filters" {...props} />
  </StyledForm>
);
