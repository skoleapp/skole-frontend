import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { CourseObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
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
  creatorInfo: {
    display: 'flex',
  },
  creator: {
    margin: `0 ${spacing(1)}`,
  },
}));

interface Props extends TableRowProps {
  course: CourseObjectType;
  hideCourseChip?: boolean;
}

export const CourseTableRow: React.FC<Props> = ({
  course: {
    slug,
    name,
    code,
    user,
    score,
    starCount,
    resourceCount,
    commentCount,
    created: _created,
  },
  hideCourseChip,
  dense,
  key,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const scoreLabel = t('common:score').toLowerCase();
  const commentsLabel = t('common:comments').toLowerCase();
  const starsLabel = t('common:stars').toLowerCase();
  const resourcesLabel = t('common:resources').toLowerCase();
  const created = useDayjs(_created).startOf('day').fromNow();

  const renderCourseChip = !hideCourseChip && <TableRowChip label={t('common:course')} />;
  const renderCourseCodeChip = <TableRowChip label={code} />;

  const renderUserLink = user?.slug && (
    <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>
  );

  const renderCourseCreator = (
    <span className={classes.creator}>{renderUserLink || t('common:communityUser')}</span>
  );

  const renderMobileCourseStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Grid container>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {scoreLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center">
              <Typography variant="subtitle1">{score}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {commentsLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center">
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
            <Grid item xs={4} sm={2} container alignItems="center">
              <Typography variant="subtitle1">{starCount}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={8} sm={10} container alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {resourcesLabel}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} container alignItems="center">
              <Typography variant="subtitle1">{resourceCount}</Typography>
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

  const renderDesktopCourseStats = (
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

  const renderCreatorInfo = (
    <Typography className={classes.creatorInfo} variant="body2" color="textSecondary">
      {t('common:createdBy')} {renderCourseCreator} {created}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderCourseChip}
      {renderCourseCodeChip}
    </Grid>
  );

  const renderCourseName = (
    <TableCell className={classes.tableCell}>
      <Typography variant="subtitle1">{name}</Typography>
    </TableCell>
  );

  const courseInfoColSpan: ColSpan = {
    xs: 12,
    md: dense ? 12 : 6,
  };

  const renderCourseInfo = (
    <Grid item xs={12} container alignItems="flex-end">
      <Grid item {...courseInfoColSpan}>
        <TableCell className={classes.tableCell}>{renderChips}</TableCell>
      </Grid>
      <Grid item {...courseInfoColSpan}>
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
    <Link href={urls.course(slug || '')} key={key}>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderCourseName}
                {renderCourseInfo}
              </Grid>
              <Grid item {...statsColSpan} container>
                {renderMobileCourseStats || renderDesktopCourseStats}
              </Grid>
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
