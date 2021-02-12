import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { ResourceObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { BORDER } from 'styles';
import { ColSpan, TableRowProps } from 'types';
import { urls } from 'utils';

import { Link, TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    borderBottom: BORDER,
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem',
  },
  tableCell: {
    padding: spacing(1),
    display: 'flex',
  },
  creatorInfoTableCell: {
    [breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));

interface Props extends TableRowProps {
  resource: ResourceObjectType;
  hideResourceChip?: boolean;
  hideDateChip?: boolean;
}

export const ResourceTableRow: React.FC<Props> = ({
  resource: {
    slug,
    title,
    date,
    resourceType,
    user,
    score,
    starCount,
    downloads,
    commentCount,
    course,
    created: _created,
  },
  hideResourceChip,
  hideDateChip,
  dense,
  key,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const _courseName = R.propOr('', 'name', course);
  const courseCode = R.propOr('', 'code', course);
  const courseName = courseCode ? `${_courseName} - ${courseCode}` : _courseName;
  const scoreLabel = t('common:score').toLowerCase();
  const commentsLabel = t('common:comments').toLowerCase();
  const starsLabel = t('common:stars').toLowerCase();
  const downloadsLabel = t('common:downloads').toLowerCase();
  const created = useDayjs(_created).startOf('day').fromNow();

  const renderResourceChip = !hideResourceChip && <TableRowChip label={t('common:resource')} />;
  const renderResourceTypeChip = !!resourceType && <TableRowChip label={resourceType.name} />;
  const renderCourseChip = !!courseName && <TableRowChip label={courseName} />;
  const renderDateChip = !hideDateChip && <TableRowChip label={useDayjs(date).format('LL')} />;

  const renderResourceCreator = user?.slug ? (
    <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>
  ) : (
    t('common:communityUser')
  );

  const renderMobileResourceStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Grid container>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {scoreLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{score}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {commentsLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{commentCount}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {starsLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{starCount}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {downloadsLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
              <Typography variant="subtitle1">{downloads}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </TableCell>
  );

  const desktopStatsColSpan: ColSpan = {
    md: dense ? 6 : 3,
    lg: 3,
  };

  const renderDesktopResourceStats = (
    <TableCell className={classes.tableCell}>
      <Grid container alignItems="center">
        <Grid item {...desktopStatsColSpan} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{score}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {scoreLabel}
            </Typography>
          </Grid>
        </Grid>
        <Grid item {...desktopStatsColSpan} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{commentCount}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {commentsLabel}
            </Typography>
          </Grid>
        </Grid>
        <Grid item {...desktopStatsColSpan} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{starCount}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {starsLabel}
            </Typography>
          </Grid>
        </Grid>
        <Grid item {...desktopStatsColSpan} container>
          <Grid item md={12} container justify="center">
            <Typography variant="subtitle1">{downloads}</Typography>
          </Grid>
          <Grid item md={12} container justify="center">
            <Typography variant="body2" color="textSecondary">
              {downloadsLabel}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </TableCell>
  );

  const renderCreatorInfo = (
    <Typography variant="body2" color="textSecondary">
      {t('common:createdBy')} {renderResourceCreator} {created}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderResourceChip}
      {renderResourceTypeChip}
      {renderDateChip}
      {renderCourseChip}
    </Grid>
  );

  const renderResourceTitle = (
    <TableCell className={classes.tableCell}>
      <Typography variant="subtitle1">{title}</Typography>
    </TableCell>
  );

  const resourceInfoColSpan: ColSpan = {
    xs: 12,
    md: dense ? 12 : 6,
  };

  const renderResourceInfo = (
    <Grid item xs={12} container alignItems="flex-end">
      <Grid item {...resourceInfoColSpan}>
        <TableCell className={clsx(classes.tableCell)}>{renderChips}</TableCell>
      </Grid>
      <Grid item {...resourceInfoColSpan} container>
        <TableCell className={clsx(classes.tableCell, !dense && classes.creatorInfoTableCell)}>
          {renderCreatorInfo}
        </TableCell>
      </Grid>
    </Grid>
  );

  const statsColSpan: ColSpan = {
    xs: 12,
    md: dense ? 6 : 4,
    lg: dense ? 5 : 3,
  };

  const mainColSpan: ColSpan = {
    xs: 12,
    md: dense ? 6 : 8,
    lg: dense ? 7 : 9,
  };

  return (
    <Link href={urls.resource(slug || '')} key={key}>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderResourceTitle}
                {renderResourceInfo}
              </Grid>
              <Grid item {...statsColSpan} container>
                {renderMobileResourceStats || renderDesktopResourceStats}
              </Grid>
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
