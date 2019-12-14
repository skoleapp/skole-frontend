import { FormikProps } from 'formik';
import React from 'react';
import { School } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

// eslint-disable-next-line @eslint-typescript/no-explicit-any

interface Props extends FormikProps<any> {
  t: (value: string) => any;
}

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SchoolField: React.FC<Props> = props => {
  const t = props.t;
  const { schools, schoolId } = props.initialValues;
  const options = schools;
  const school = schools.find((s: School) => s.id === schoolId);
  const initialValue = (school && school.name) || '';
  const dataKey = 'id';
  const fieldName = 'schoolId';
  const label = t('fieldSchool');

  const { renderAutoCompleteField } = useAutoCompleteField({
    ...props,
    options,
    initialValue,
    dataKey,
    fieldName,
    label
  });

  return renderAutoCompleteField;
};
