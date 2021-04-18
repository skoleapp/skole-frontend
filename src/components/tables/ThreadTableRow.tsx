import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { ThreadObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { BORDER, useMediaQueries } from 'styles';
import { mediaLoader, urls } from 'utils';

import { Link, MarkdownContent, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  root: {
    borderBottom: BORDER,
    minHeight: '6rem',
    padding: spacing(1),
  },
  tableCell: {
    padding: spacing(1),
    display: 'flex',
  },
  threadInfoContainer: {
    overflow: 'hidden',
  },
  imagePreview: {
    border: `0.1rem solid ${palette.primary.main} !important`,
    borderRadius: '0.5rem',
  },
  imageThumbnailContainer: {
    width: 'auto',
  },
  imageThumbnailTableCell: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    [breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
  creatorInfoTableCell: {
    flexGrow: 'unset',
  },
}));

interface Props {
  thread: ThreadObjectType;
}

export const ThreadTableRow: React.FC<Props> = ({
  thread: {
    slug,
    title,
    text,
    imageThumbnail,
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
        <Typography className="truncate-text" variant="subtitle1">
          {title}
        </Typography>
      </TableCell>
    ),
    [classes.tableCell, title],
  );

  const renderImageThumbnail = useMemo(
    () =>
      !!imageThumbnail && (
        <TableCell className={clsx(classes.tableCell, classes.imageThumbnailTableCell)}>
          <Image
            className={classes.imagePreview}
            loader={mediaLoader}
            src={imageThumbnail}
            layout="intrinsic"
            width={75}
            height={75}
          />
        </TableCell>
      ),
    [classes.imagePreview, classes.tableCell, classes.imageThumbnailTableCell, imageThumbnail],
  );

  const renderTextPreview = useMemo(
    () =>
      !!text && (
        <TableCell className={classes.tableCell}>
          <Typography variant="body2">
            <MarkdownContent dense>{text}</MarkdownContent>
          </Typography>
        </TableCell>
      ),
    [classes.tableCell, text],
  );

  const renderUserLink = useMemo(
    () => user?.slug && <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>,
    [user?.slug, user?.username],
  );

  const renderCreatorInfo = useMemo(
    () => (
      <TableCell className={clsx(classes.tableCell, classes.creatorInfoTableCell)}>
        <Typography variant="body2" color="textSecondary">
          {t('common:createdBy')} {renderUserLink || t('common:anonymousStudent')} {created}
        </Typography>
      </TableCell>
    ),
    [classes.tableCell, created, renderUserLink, t, classes.creatorInfoTableCell],
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
            <Grid item xs={12} container justify="center">
              <Typography variant="subtitle1">{score}</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {scoreLabel}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} container>
            <Grid item xs={12} container justify="center">
              <Typography variant="subtitle1">{commentCount}</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {commentsLabel}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} container>
            <Grid item xs={12} container justify="center">
              <Typography variant="subtitle1">{starCount}</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
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

  return (
    <Link href={urls.thread(slug || '')} fullWidth>
      <CardActionArea>
        <TableRow className={classes.root}>
          <Grid container>
            <Grid item xs={12} md={8} lg={9} container wrap="nowrap">
              <Grid
                className={classes.threadInfoContainer}
                item
                container
                direction="column"
                wrap="nowrap"
              >
                {renderTitle}
                {renderTextPreview}
                {renderCreatorInfo}
              </Grid>
              <Grid className={classes.imageThumbnailContainer} item container>
                {renderImageThumbnail}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} lg={3} container>
              {renderMobileThreadStats || renderDesktopThreadStats}
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
