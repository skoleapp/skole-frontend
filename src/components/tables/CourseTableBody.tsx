import TableBody from '@material-ui/core/TableBody';
import { CourseObjectType } from 'generated';
import React from 'react';

import { CourseTableRow } from './CourseTableRow';

interface Props {
  courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => {
  const mapCourses = courses.map((c, i) => <CourseTableRow course={c} disableCourseChip key={i} />);
  return <TableBody>{mapCourses}</TableBody>;
};
