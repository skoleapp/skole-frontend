import TableBody from '@material-ui/core/TableBody';
import { ResourceObjectType } from 'generated';
import React from 'react';
import { MainTemplateProps } from 'types';

import { ResourceTableRow } from './ResourceTableRow';

interface Props extends Pick<MainTemplateProps, 'pageRef'> {
  resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources, pageRef }) => {
  const mapResources = resources.map((c, i) => (
    <ResourceTableRow resource={c} hideResourceChip pageRef={pageRef} key={i} />
  ));

  return <TableBody>{mapResources}</TableBody>;
};
