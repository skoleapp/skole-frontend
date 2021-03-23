import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer, { TableContainerProps } from '@material-ui/core/TableContainer';
import { CommentObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { CommentTableRow } from './CommentTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  trendingComments: CommentObjectType[];
  renderTableFooter: JSX.Element;
  tableContainerProps?: TableContainerProps;
}

export const TrendingTable: React.FC<Props> = ({
  trendingComments,
  renderTableFooter,
  tableContainerProps,
  ...tableRowProps
}) => {
  const mapComments = trendingComments.map((c, i) => (
    <CommentTableRow comment={c} key={i} {...tableRowProps} />
  ));

  const renderTableBody = <TableBody>{mapComments}</TableBody>;

  return (
    <TableContainer {...tableContainerProps}>
      <Table>
        {renderTableBody}
        {renderTableFooter}
      </Table>
    </TableContainer>
  );
};
