import { FormikProps } from 'formik';
import React from 'react';
import { FormSubmitSection, SchoolField, StyledForm } from '../components';
import { FilterSubjectsFormValues } from '../interfaces';

export const FilterSubjectsForm: React.FC<FormikProps<FilterSubjectsFormValues>> = props => (
  <StyledForm>
    <SchoolField {...props} />
    <FormSubmitSection submitButtonText="apply" {...props} />
  </StyledForm>
);
