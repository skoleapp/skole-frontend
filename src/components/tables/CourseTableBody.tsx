import TableBody from '@material-ui/core/TableBody';
import { CourseObjectType } from 'generated';
import React from 'react';
import { MainTemplateProps } from 'types';

import { CourseTableRow } from './CourseTableRow';

interface Props extends Pick<MainTemplateProps, 'pageRef'> {
  courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses, pageRef }) => {
  const mapCourses = courses.map((c, i) => (
    <CourseTableRow course={c} disableCourseChip pageRef={pageRef} key={i} />
  ));

  return <TableBody>{mapCourses}</TableBody>;
};
