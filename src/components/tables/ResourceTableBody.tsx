import TableBody from '@material-ui/core/TableBody';
import { ResourceObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { ResourceTableRow } from './ResourceTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  resources: ResourceObjectType[];
  hideCourseLink?: boolean;
}

export const ResourceTableBody: React.FC<Props> = ({
  resources,
  hideCourseLink,
  ...tableRowProps
}) => {
  const mapResources = resources.map((c, i) => (
    <ResourceTableRow
      resource={c}
      hideResourceChip
      hideCourseLink={hideCourseLink}
      key={i}
      {...tableRowProps}
    />
  ));

  return <TableBody>{mapResources}</TableBody>;
};
