import { FormikProps } from 'formik';
import React from 'react';
import { Course } from '../../interfaces';
import { useAutoCompleteField } from '../../utils';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
export const CourseField: React.FC<FormikProps<any>> = props => {
  const { courses, courseId } = props.initialValues;
  const options = courses;
  const course = courses.find((c: Course) => c.id === courseId);
  const initialValue = (course && course.name) || '';
  const dataKey = 'id';
  const fieldName = 'courseId';
  const label = 'Course';

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
