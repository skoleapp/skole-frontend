import { FormikProps } from 'formik';
import React from 'react';
import { FormSubmitSection, SchoolField, StyledForm } from '../components';
import { FilterSubjectsFormValues, School } from '../interfaces';

interface Props extends FormikProps<FilterSubjectsFormValues> {
  schools: School[];
}

export const FilterSubjectsForm: React.FC<Props> = props => (
  <StyledForm>
    <SchoolField {...props} />
    <FormSubmitSection submitButtonText="apply" {...props} />
  </StyledForm>
);
