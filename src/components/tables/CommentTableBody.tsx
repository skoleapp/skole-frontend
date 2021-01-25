import TableBody from '@material-ui/core/TableBody';
import { CommentObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { CommentTableRow } from './CommentTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  comments: CommentObjectType[];
}

export const CommentTableBody: React.FC<Props> = ({ comments, ...tableRowProps }) => {
  const mapComments = comments.map((c, i) => (
    <CommentTableRow comment={c} hideCommentChip key={i} {...tableRowProps} />
  ));

  return <TableBody>{mapComments}</TableBody>;
};
