import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer, { TableContainerProps } from '@material-ui/core/TableContainer';
import { SuggestionsUnion } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { CommentTableRow } from './CommentTableRow';
import { CourseTableRow } from './CourseTableRow';
import { ResourceTableRow } from './ResourceTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  suggestions: SuggestionsUnion[];
  renderTableFooter: JSX.Element;
  tableContainerProps?: TableContainerProps;
}

export const SuggestionsTable: React.FC<Props> = ({
  suggestions,
  renderTableFooter,
  tableContainerProps,
  ...tableRowProps
}) => {
  const renderSuggestion = (suggestion: SuggestionsUnion, i: number): JSX.Element | void => {
    switch (suggestion.__typename) {
      case 'CourseObjectType': {
        return <CourseTableRow course={suggestion} key={i} {...tableRowProps} />;
      }

      case 'ResourceObjectType': {
        return <ResourceTableRow resource={suggestion} key={i} {...tableRowProps} />;
      }

      case 'CommentObjectType': {
        // Rename the property back, since we couldn't use the `course` name for both `resource.course` and
        // `comment.course` because of their different nullability shapes, so we used an alias for the latter.
        // @ts-ignore: We know that this aliased key now exists on the object.
        const { commentCourse: course, ...rest } = suggestion;
        const commentSuggestion = { course, ...rest };
        return <CommentTableRow comment={commentSuggestion} key={i} {...tableRowProps} />;
      }

      default: {
        break;
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
