import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';
import React, { useMemo } from 'react';

export const SkeletonCommentList: React.FC = () => {
  const renderTableBody = useMemo(
    () => (
      <TableBody>
        {new Array(25).fill(0).map((_, i) => (
          <Box padding={2} key={i}>
            <Grid container spacing={2}>
              <Grid item xs={10} sm={11}>
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
                  <Skeleton variant="rect" width="100%" height="4rem" />
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    <Skeleton />
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2} sm={1}>
                <Box width="100%" height="100%" paddingTop={2} paddingBottom={1}>
                  <Skeleton variant="rect" width="100%" height="100%" />
                </Box>
              </Grid>
            </Grid>
          </Box>
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
