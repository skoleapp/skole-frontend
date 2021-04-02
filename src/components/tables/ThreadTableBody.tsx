import TableBody from '@material-ui/core/TableBody';
import { ThreadObjectType } from 'generated';
import React, { useMemo } from 'react';

import { ThreadTableRow } from './ThreadTableRow';

interface Props {
  threads: ThreadObjectType[];
}

export const ThreadTableBody: React.FC<Props> = ({ threads, ...tableRowProps }) => {
  const mapThreads = useMemo(
    () => threads.map((t, i) => <ThreadTableRow thread={t} key={i} {...tableRowProps} />),
    [tableRowProps, threads],
  );

  return <TableBody>{mapThreads}</TableBody>;
};
