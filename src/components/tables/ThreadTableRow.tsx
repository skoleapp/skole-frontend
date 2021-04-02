import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ThreadObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { BORDER } from 'styles';
import { ColSpan } from 'types';
import { urls } from 'utils';

import { Link, TextLink } from '../shared';

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

interface Props {
  thread: ThreadObjectType;
}

export const ThreadTableRow: React.FC<Props> = ({
  thread: {
    slug,
    title,
    // TODO: Add the thread text and image thumbnail to the card.
    // text,
    // image,
    // imageThumbnail,
    user,
    score,
    starCount,
    commentCount,
    created: _created,
  },
}) => {
  const { t } = useTranslation();
  const { smDown } = useMediaQueries();
  const classes = useStyles();
  const scoreLabel = t('common:score').toLowerCase();
  const commentsLabel = t('common:comments').toLowerCase();
  const starsLabel = t('common:stars').toLowerCase();
  const created = useDayjs(_created).startOf('day').fromNow();

  const renderTitle = useMemo(
    () => (
      <TableCell className={classes.tableCell}>
        <Typography variant="subtitle1">{title}</Typography>
      </TableCell>
    ),
    [classes.tableCell, title],
  );

  const renderUserLink = useMemo(
    () => user?.slug && <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>,
    [user?.slug, user?.username],
  );

  const renderCreatorInfo = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {t('common:createdBy')} {renderUserLink || t('common:communityUser')} {created}
      </Typography>
    ),
    [created, renderUserLink, t],
  );

  const renderThreadInfo = useMemo(
    () => (
      <Grid item xs={12} container direction="column">
        <TableCell className={classes.tableCell}>{renderCreatorInfo}</TableCell>
      </Grid>
    ),
    [classes.tableCell, renderCreatorInfo],
  );

  const renderMobileThreadStats = useMemo(
    () =>
      smDown && (
        <TableCell className={classes.tableCell}>
          <Typography variant="body2" color="textSecondary">
            {score} {scoreLabel} | {commentCount} {commentsLabel} | {starCount} {starsLabel}
          </Typography>
        </TableCell>
      ),
    [
      classes.tableCell,
      commentCount,
      commentsLabel,
      score,
      scoreLabel,
      smDown,
      starCount,
      starsLabel,
    ],
  );

  const renderDesktopThreadStats = useMemo(
    () => (
      <TableCell className={classes.tableCell}>
        <Grid container alignItems="center">
          <Grid item xs={4} container>
            <Grid item md={12} container justify="center">
              <Typography variant="subtitle1">{score}</Typography>
            </Grid>
            <Grid item md={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {scoreLabel}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} container>
            <Grid item md={12} container justify="center">
              <Typography variant="subtitle1">{commentCount}</Typography>
            </Grid>
            <Grid item md={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {commentsLabel}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} container>
            <Grid item md={12} container justify="center">
              <Typography variant="subtitle1">{starCount}</Typography>
            </Grid>
            <Grid item md={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {starsLabel}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
    ),
    [classes.tableCell, commentCount, commentsLabel, score, scoreLabel, starCount, starsLabel],
  );

  const statsColSpan: ColSpan = {
    xs: 12,
    md: 4,
    lg: 3,
  };

  const mainColSpan: ColSpan = {
    xs: 12,
    md: 8,
    lg: 9,
  };

  return (
    <Link href={urls.thread(slug || '')} fullWidth>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderTitle}
                {renderThreadInfo}
              </Grid>
              <Grid item {...statsColSpan} container>
                {renderMobileThreadStats || renderDesktopThreadStats}
              </Grid>
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
