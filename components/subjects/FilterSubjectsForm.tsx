import React from 'react';
import { FormikProps } from 'formik';
import { FormSubmitSection, SchoolField, StyledForm } from '..';
import { FilterSubjectsFormValues, School } from '../../interfaces';

interface Props extends FormikProps<FilterSubjectsFormValues> {
  schools: School[];
  t: (value: string) => any;
}

export const FilterSubjectsForm: React.FC<Props> = props => {
  const t = props.t;
  return (
    <StyledForm>
      <SchoolField {...props} />
      <FormSubmitSection submitButtonText={t('buttonApply')} {...props} />
    </StyledForm>
  );
};
