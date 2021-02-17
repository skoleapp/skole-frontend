import TableBody from '@material-ui/core/TableBody';
import { CourseObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { CourseTableRow } from './CourseTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  courses: CourseObjectType[];
  hideSchoolLink?: boolean;
}

export const CourseTableBody: React.FC<Props> = ({ courses, hideSchoolLink, ...tableRowProps }) => {
  const mapCourses = courses.map((c, i) => (
    <CourseTableRow
      course={c}
      hideCourseChip
      hideSchoolLink={hideSchoolLink}
      key={i}
      {...tableRowProps}
    />
  ));

  return <TableBody>{mapCourses}</TableBody>;
};
