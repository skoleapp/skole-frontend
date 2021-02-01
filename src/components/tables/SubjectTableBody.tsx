import TableBody from '@material-ui/core/TableBody';
import { SubjectObjectType } from 'generated';
import React from 'react';

import { SubjectTableRow } from './SubjectTableRow';

interface Props {
  subjects: SubjectObjectType[];
}

export const SubjectTableBody: React.FC<Props> = ({ subjects }) => {
  const mapSubjects = subjects.map((c, i) => <SubjectTableRow subject={c} key={i} />);
  return <TableBody>{mapSubjects}</TableBody>;
};
