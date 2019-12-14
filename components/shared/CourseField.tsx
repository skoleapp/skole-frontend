import { FormikProps } from 'formik';
import React from 'react';
import { Course } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

interface Props extends FormikProps<any> {
  t: (value: string) => any;
}

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const CourseField: React.FC<Props> = props => {
  const t = props.t;
  const { courses, courseId } = props.initialValues;
  const options = courses;
  const course = courses.find((c: Course) => c.id === courseId);
  const initialValue = (course && course.name) || '';
  const dataKey = 'id';
  const fieldName = 'courseId';
  const label = t('fieldCourse');

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
