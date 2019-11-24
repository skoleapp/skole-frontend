import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, SchoolTypeField, StyledForm } from '.';
import { FilterSchoolsFormValues } from '../interfaces';

export const FilterSchoolsForm: React.FC<FormikProps<FilterSchoolsFormValues>> = props => (
  <StyledForm>
    <SchoolTypeField {...props} />
    <Field
      name="schoolName"
      component={TextField}
      label="School Name"
      placeholder="School Name"
      fullWidth
    />
    <Field
      name="schoolCity"
      component={TextField}
      label="School City"
      placeholder="School City"
      fullWidth
    />
    <Field
      name="schoolCountry"
      component={TextField}
      label="School Country"
      placeholder="School Country"
      fullWidth
    />
    <FormSubmitSection submitButtonText="apply filters" {...props} />
  </StyledForm>
);
