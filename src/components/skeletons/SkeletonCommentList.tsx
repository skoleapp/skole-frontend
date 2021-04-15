import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';

export const SkeletonCommentList: React.FC = () => {
  const renderSkeletonList = useMemo(
    () =>
      new Array(25).fill(0).map(() => (
        <Box padding={2}>
          <Box display="flex" alignItems="center">
            <Box>
              <Skeleton variant="circle">
                <Avatar />
              </Skeleton>
            </Box>
            <Box marginLeft={2} width="100%">
              <Typography variant="subtitle1">
                <Skeleton />
              </Typography>
              <Typography variant="subtitle2">
                <Skeleton />
              </Typography>
            </Box>
          </Box>
          <Box marginTop={2}>
            <Skeleton variant="rect" width="100%" height="10rem" />
          </Box>
        </Box>
      )),
    [],
  );

  const renderTableFooter = useMemo(() => <TableFooter />, []);

  return (
    <>
      {renderSkeletonList}
      {renderTableFooter}
    </>
  );
};
