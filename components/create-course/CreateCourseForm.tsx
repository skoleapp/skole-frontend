import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { CreateCourseFormValues, School, Subject } from '../../interfaces';
import { FormSubmitSection, SchoolField, StyledForm, SubjectField } from '../shared';

interface Props extends FormikProps<CreateCourseFormValues> {
  subjects: Subject[];
  schools: School[];
}

export const CreateCourseForm: React.FC<Props> = props => (
  <StyledForm>
    <Field
      name="courseName"
      placeholder="Course Name"
      label="Course Name"
      component={TextField}
      fullWidth
    />
    <Field
      name="courseCode"
      placeholder="Course Code"
      label="Course Code"
      component={TextField}
      fullWidth
    />
    <SubjectField {...props} />
    <SchoolField {...props} />
    <FormSubmitSection submitButtonText="save" {...props} />
  </StyledForm>
);
