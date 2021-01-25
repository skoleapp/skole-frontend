import TableBody from '@material-ui/core/TableBody';
import { CourseObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { CourseTableRow } from './CourseTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses, ...tableRowProps }) => {
  const mapCourses = courses.map((c, i) => (
    <CourseTableRow course={c} hideCourseChip key={i} {...tableRowProps} />
  ));

  return <TableBody>{mapCourses}</TableBody>;
};
