import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { SchoolType } from '../../generated/graphql';
import { FilterSchoolsFormValues } from '../../interfaces';
import { FormSubmitSection, SchoolTypeField, StyledForm } from '../shared';

interface Props extends FormikProps<FilterSchoolsFormValues> {
  schoolTypes: SchoolType[];
  t: (value: string) => any;
}

export const FilterSchoolsForm: React.FC<Props> = props => {
  const t = props.t;
  return (
    <StyledForm>
      <SchoolTypeField {...props} />
      <Field
        name="schoolName"
        component={TextField}
        label={t('fieldSchoolName')}
        placeholder={t('fieldSchoolName')}
        fullWidth
      />
      <Field
        name="schoolCity"
        label={t('fieldSchoolCity')}
        component={TextField}
        placeholder={t('fieldSchoolCity')}
        fullWidth
      />
      <Field
        name="schoolCountry"
        component={TextField}
        label={t('fieldSchoolCountry')}
        placeholder={t('fieldSchoolCountry')}
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('buttonApplyFilters')} {...props} />
    </StyledForm>
  );
};
