import TableBody from '@material-ui/core/TableBody';
import { ActivityObjectType } from 'generated';
import React from 'react';

import { ActivityListItem } from '../activity';

interface Props {
  activities: ActivityObjectType[];
}

export const ActivityTableBody: React.FC<Props> = ({ activities }) => (
  <TableBody>
    {activities.map((a, i) => (
      <ActivityListItem
        key={`${a.id}_${i}_${a.read}`} // Ensure the key is always unique for different activities in different order.
        activity={a}
      />
    ))}
  </TableBody>
);
