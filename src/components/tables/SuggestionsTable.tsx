import { Table, TableBody, TableContainer, TableContainerProps } from '@material-ui/core';
import { SuggestionsUnion } from 'generated';
import React from 'react';
import { CommentTableRow } from './CommentTableRow';
import { CourseTableRow } from './CourseTableRow';
import { ResourceTableRow } from './ResourceTableRow';

interface Props {
  suggestions: SuggestionsUnion[];
  renderTableFooter: JSX.Element;
  tableContainerProps?: TableContainerProps;
}

export const SuggestionsTable: React.FC<Props> = ({
  suggestions,
  renderTableFooter,
  tableContainerProps,
}) => {
  const renderSuggestion = (suggestion: SuggestionsUnion, i: number) => {
    switch (suggestion.__typename) {
      case 'CourseObjectType': {
        return <CourseTableRow course={suggestion} key={i} />;
      }

      case 'ResourceObjectType': {
        return <ResourceTableRow resource={suggestion} hideDateChip key={i} />;
      }

      case 'CommentObjectType': {
        return <CommentTableRow comment={suggestion} key={i} />;
      }
    }
  };

  const renderTableBody = <TableBody>{suggestions.map(renderSuggestion)}</TableBody>;

  return (
    <TableContainer {...tableContainerProps}>
      <Table>
        {renderTableBody}
        {renderTableFooter}
      </Table>
    </TableContainer>
  );
};
