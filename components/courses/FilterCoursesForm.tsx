import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FilterCoursesFormValues, School, Subject } from '../../interfaces';
import { FormSubmitSection, SchoolField, StyledForm, SubjectField } from '../shared';

interface Props extends FormikProps<FilterCoursesFormValues> {
  schools: School[];
  subjects: Subject[];
}

export const FilterCoursesForm: React.FC<Props> = props => (
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
