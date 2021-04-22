import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';

export const SkeletonActivityTableList: React.FC = () => {
  const renderTableBody = useMemo(
    () => (
      <TableBody>
        {new Array(25).fill(0).map(() => (
          <ListItem className="activity-li">
            <ListItemAvatar>
              <Skeleton variant="circle">
                <Avatar />
              </Skeleton>
            </ListItemAvatar>
            <ListItemText>
              <Skeleton />
            </ListItemText>
          </ListItem>
        ))}
      </TableBody>
    ),
    [],
  );

  const renderTableFooter = useMemo(() => <TableFooter />, []);

  return (
    <>
      {renderTableBody}
      {renderTableFooter}
    </>
  );
};
