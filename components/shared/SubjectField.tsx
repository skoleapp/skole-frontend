import { FormikProps } from 'formik';
import React from 'react';
import { Subject } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

// eslint-disable-next-line @eslint-typescript/no-explicit-any

interface Props extends FormikProps<any> {
  t: (value: string) => any;
}

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const SubjectField: React.FC<Props> = props => {
  const t = props.t;
  const { subjects, subjectId } = props.initialValues;
  const options = subjects;
  const subject = subjects.find((s: Subject) => s.id === subjectId);
  const initialValue = (subject && subject.name) || '';
  const dataKey = 'id';
  const fieldName = 'subjectId';
  const label = t('fieldSubject');

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
