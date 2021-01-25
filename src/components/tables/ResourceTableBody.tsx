import TableBody from '@material-ui/core/TableBody';
import { ResourceObjectType } from 'generated';
import React from 'react';
import { TableRowProps } from 'types';

import { ResourceTableRow } from './ResourceTableRow';

interface Props extends Omit<TableRowProps, 'key'> {
  resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources, ...tableRowProps }) => {
  const mapResources = resources.map((c, i) => (
    <ResourceTableRow resource={c} hideResourceChip key={i} {...tableRowProps} />
  ));

  return <TableBody>{mapResources}</TableBody>;
};
