import TableBody from '@material-ui/core/TableBody';
import { CommentObjectType } from 'generated';
import React from 'react';

import { CommentTableRow } from './CommentTableRow';

interface Props {
  comments: CommentObjectType[];
}

export const CommentTableBody: React.FC<Props> = ({ comments }) => {
  const mapComments = comments.map((c, i) => (
    <CommentTableRow comment={c} hideCommentChip key={i} />
  ));

  return <TableBody>{mapComments}</TableBody>;
};
