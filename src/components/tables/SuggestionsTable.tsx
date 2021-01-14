import { Table, TableContainer, TableProps } from '@material-ui/core';
import { CourseObjectType } from 'generated';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { CourseTableBody } from './CourseTableBody';
import { CustomTableHead } from './CustomTableHead';

interface Props {
  courses: CourseObjectType[];
  renderTableFooter: JSX.Element;
  tableProps?: TableProps;
}

export const SuggestionsTable: React.FC<Props> = ({ courses, renderTableFooter, tableProps }) => {
  const { t } = useTranslation();

  const tableHeadProps = {
    titleLeft: t('common:name'),
    titleRight: t('common:score'),
  };

  const renderTableHead = <CustomTableHead {...tableHeadProps} />;
  const renderTableBody = <CourseTableBody courses={courses} />;

  return (
    <TableContainer>
      <Table {...tableProps}>
        {renderTableHead}
        {renderTableBody}
        {renderTableFooter}
      </Table>
    </TableContainer>
  );
};
