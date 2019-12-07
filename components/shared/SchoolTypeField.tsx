import { FormikProps } from 'formik';
import React from 'react';
import { SchoolType } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SchoolTypeField: React.FC<FormikProps<any>> = props => {
  const { schoolTypes, schoolType } = props.initialValues;
  const options = schoolTypes;
  const selectedSchoolType = schoolTypes.find((s: SchoolType) => s.name === schoolType.name);
  const initialValue = (selectedSchoolType && selectedSchoolType.name) || '';
  const dataKey = 'name';
  const fieldName = 'schoolType';
  const label = 'School Type';

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
