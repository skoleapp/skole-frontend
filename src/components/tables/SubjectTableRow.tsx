import { SubjectObjectType } from '__generated__/src/graphql/common.graphql';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER } from 'styles';
import { TableRowProps } from 'types';
import { urls } from 'utils';

import { Link } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    borderBottom: BORDER,
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem',
  },
  tableCell: {
    padding: spacing(1),
    display: 'flex',
  },
}));

interface Props extends Omit<TableRowProps, 'dense'> {
  subject: SubjectObjectType;
}

export const SubjectTableRow: React.FC<Props> = ({
  subject: { slug, name, courseCount, resourceCount },
  key,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const coursesLabel = t('common:courses').toLowerCase();
  const resourcesLabel = t('common:resources').toLowerCase();

  const renderMobileSubjectStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Grid container>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {coursesLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{courseCount}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {resourcesLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{resourceCount}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </TableCell>
  );

  const renderDesktopSubjectStats = (
    <TableCell className={classes.tableCell}>
      <Grid container alignItems="center">
        <Grid item md={6} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{courseCount}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {coursesLabel}
            </Typography>
          </Grid>
        </Grid>
        <Grid item md={6} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{resourceCount}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {resourcesLabel}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </TableCell>
  );

  const renderSubjectName = (
    <TableCell className={classes.tableCell}>
      <Typography variant="subtitle1">{name}</Typography>
    </TableCell>
  );

  return (
    <Link href={urls.course(slug || '')} key={key}>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={12} md={6} lg={7} container>
                {renderSubjectName}
              </Grid>
              <Grid item xs={12} md={6} lg={5} container>
                {renderMobileSubjectStats || renderDesktopSubjectStats}
              </Grid>
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
