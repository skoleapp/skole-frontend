import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, SchoolField, StyledForm, SubjectField } from '../components';
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
    <SubjectField {...props} />
    <SchoolField {...props} />
    <FormSubmitSection submitButtonText="save" {...props} />
  </StyledForm>
);
