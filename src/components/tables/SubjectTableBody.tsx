import TableBody from '@material-ui/core/TableBody';
import { SchoolObjectType, SubjectObjectType } from 'generated';
import React from 'react';

import { SubjectTableRow } from './SubjectTableRow';

interface Props {
  subjects: SubjectObjectType[];
  school: SchoolObjectType;
}

export const SubjectTableBody: React.FC<Props> = ({ subjects, school }) => {
  const mapSubjects = subjects.map((c, i) => (
    <SubjectTableRow subject={c} school={school} key={i} />
  ));
  return <TableBody>{mapSubjects}</TableBody>;
};
