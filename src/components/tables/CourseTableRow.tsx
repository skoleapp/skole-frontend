import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { CourseObjectType } from 'generated';
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
  course: CourseObjectType;
  hideCourseChip?: boolean;
  hideSchoolLink?: boolean;
}

export const CourseTableRow: React.FC<Props> = ({
  course: {
    slug,
    codes,
    user,
    score,
    starCount,
    resourceCount,
    commentCount,
    created: _created,
    // @ts-ignore: An alias has been set in GraphQL query.
    courseSchool,
  },
  hideCourseChip,
  hideSchoolLink,
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
  const discussionName = `#${slug}`;

  const renderDiscussionName = (
    <TableCell className={classes.tableCell}>
      <Typography variant="subtitle1">{discussionName}</Typography>
    </TableCell>
  );

  const renderCourseChip = !hideCourseChip && <TableRowChip label={`${t('common:course')} 🎓`} />;
  const renderCourseCodesChip = <TableRowChip label={codes} />;

  const renderChips = (
    <Grid container>
      {renderCourseChip}
      {renderCourseCodesChip}
    </Grid>
  );

  const renderUserLink = user?.slug && (
    <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>
  );

  const renderSchoolLink = !!courseSchool.slug && !hideSchoolLink && (
    <>
      {' '}
      @ <TextLink href={urls.school(courseSchool.slug)}>{`#${courseSchool.slug}`}</TextLink>
    </>
  );

  const renderCreatorInfo = (
    <Typography variant="body2" color="textSecondary">
      {t('common:createdBy')} {renderUserLink || t('common:communityUser')} {created}
      {renderSchoolLink}
    </Typography>
  );

  const renderCourseInfo = (
    <Grid item xs={12} container direction="column">
      <TableCell className={classes.tableCell}>{renderChips}</TableCell>
      <TableCell className={classes.tableCell}>{renderCreatorInfo}</TableCell>
    </Grid>
  );

  const renderMobileCourseStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Typography variant="body2" color="textSecondary">
        {score} {scoreLabel} | {commentCount} {commentsLabel} | {starCount} {starsLabel} |{' '}
        {resourceCount} {resourcesLabel}
      </Typography>
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
    <Link href={urls.course(slug || '')} key={key} fullWidth>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderDiscussionName}
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
