import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';
import { useMediaQueryContext } from 'context';
import React, { useMemo } from 'react';

export const SkeletonThreadTableList: React.FC = () => {
  const { smDown } = useMediaQueryContext();

  const renderMobileSkeleton = useMemo(
    () =>
      smDown && (
        <Typography variant="body2">
          <Skeleton />
        </Typography>
      ),
    [smDown],
  );

  const renderDesktopSkeleton = useMemo(
    () => (
      <Box
        padding={1}
        marginLeft={2}
        display="flex"
        width="100%"
        height="100%"
        justifyContent="center"
      >
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={4}>
            <Skeleton variant="rect" height="100%" />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height="100%" />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height="100%" />
          </Grid>
        </Grid>
      </Box>
    ),
    [],
  );

  const renderTableBody = useMemo(
    () => (
      <TableBody>
        {new Array(25).fill(0).map((_, i) => (
          <Box height="6rem" padding={2} display="flex" key={i}>
            <Grid container>
              <Grid item xs={12} md={8} container direction="column" justify="space-between">
                <Typography variant="subtitle1">
                  <Skeleton />
                </Typography>
                <Typography variant="body2">
                  <Skeleton />
                </Typography>
                <Typography variant="body2">
                  <Skeleton />
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} container>
                {renderMobileSkeleton || renderDesktopSkeleton}
              </Grid>
            </Grid>
          </Box>
        ))}
      </TableBody>
    ),
    [renderDesktopSkeleton, renderMobileSkeleton],
  );

  const renderTableFooter = useMemo(() => <TableFooter />, []);

  return (
    <>
      {renderTableBody}
      {renderTableFooter}
    </>
  );
};
