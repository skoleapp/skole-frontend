import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ResourceObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER } from 'styles';
import { ColSpan, TableRowProps } from 'types';
import { urls } from 'utils';

import { Link, TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';

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

interface Props extends TableRowProps {
  resource: ResourceObjectType;
  hideCourseLink?: boolean;
}

export const ResourceTableRow: React.FC<Props> = ({
  resource: {
    title,
    slug,
    date,
    resourceType,
    user,
    score,
    starCount,
    downloads,
    commentCount,
    // @ts-ignore: An alias has been set in GraphQL query.
    resourceCourse,
    created: _created,
  },
  hideCourseLink,
  dense,
  key,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const scoreLabel = t('common:score').toLowerCase();
  const commentsLabel = t('common:comments').toLowerCase();
  const starsLabel = t('common:stars').toLowerCase();
  const downloadsLabel = t('common:downloads').toLowerCase();
  const created = useDayjs(_created).startOf('day').fromNow();

  const renderResourceTypeChip = !!resourceType && <TableRowChip label={resourceType.name} />;
  const renderDateChip = <TableRowChip label={useDayjs(date).format('LL')} />;

  const renderUserLink = user?.slug && (
    <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>
  );

  const renderCourseLink = !!resourceCourse.slug && !hideCourseLink && (
    <>
      {' '}
      @ <TextLink href={urls.course(resourceCourse.slug)}>{`#${resourceCourse.slug}`}</TextLink>
    </>
  );

  const renderMobileResourceStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Typography variant="body2" color="textSecondary">
        {score} {scoreLabel} | {commentCount} {commentsLabel} | {starCount} {starsLabel} |{' '}
        {downloads} {downloadsLabel}
      </Typography>
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
      {t('common:uploadedBy')} {renderUserLink || t('common:communityUser')} {created}
      {renderCourseLink}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderResourceTypeChip}
      {renderDateChip}
    </Grid>
  );

  const renderDiscussionName = (
    <TableCell className={classes.tableCell}>
      <Typography variant="subtitle1">{title}</Typography>
    </TableCell>
  );

  const renderResourceInfo = (
    <Grid item xs={12} container direction="column">
      <TableCell className={classes.tableCell}>{renderChips}</TableCell>
      <TableCell className={classes.tableCell}>{renderCreatorInfo}</TableCell>
    </Grid>
  );

  const statsColSpan: ColSpan = {
    xs: 12,
    md: 4,
    lg: dense ? 5 : 3,
  };

  const mainColSpan: ColSpan = {
    xs: 12,
    md: 8,
    lg: dense ? 7 : 9,
  };

  return (
    <Link href={urls.resource(slug || '')} key={key} fullWidth>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderDiscussionName}
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
