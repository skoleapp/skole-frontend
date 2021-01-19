import TableBody from '@material-ui/core/TableBody';
import { ResourceObjectType } from 'generated';
import React from 'react';

import { ResourceTableRow } from './ResourceTableRow';

interface Props {
  resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources }) => {
  const mapResources = resources.map((c, i) => (
    <ResourceTableRow resource={c} hideResourceChip key={i} />
  ));

  return <TableBody>{mapResources}</TableBody>;
};
