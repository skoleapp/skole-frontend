import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { CommentObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { BORDER } from 'styles';
import { ColSpan } from 'types';
import { mediaLoader, truncate, urls } from 'utils';

import { Link, MarkdownContent, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderBottom: BORDER,
    paddingLeft: '0.3rem',
    paddingRight: '0.3rem',
  },
  tableCell: {
    padding: spacing(1),
    display: 'flex',
  },
  commentPreviewTableCell: {
    paddingBottom: 0,
    overflow: 'hidden',
    '& *': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  imagePreviewContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  imagePreview: {
    border: `0.1rem solid ${palette.primary.main} !important`,
    borderRadius: '0.5rem',
  },
}));

interface Props {
  comment: CommentObjectType;
  key?: number;
}

export const CommentTableRow: React.FC<Props> = ({
  comment: {
    id,
    text,
    imageThumbnail,
    created: _created,
    score,
    replyCount,
    user,
    thread: _thread,
    comment,
  },
  key,
}) => {
  const { t } = useTranslation();
  const { smDown } = useMediaQueries();
  const classes = useStyles();
  const created = useDayjs(_created).startOf('day').fromNow();
  const scoreLabel = t('common:score').toLowerCase();
  const repliesLabel = t('common:replies').toLowerCase();
  const commentPreview = !!text && truncate(text, 50);
  const thread = _thread || comment?.thread;
  const pathname = urls.thread(thread?.slug || '');

  const href = useMemo(
    () => ({
      pathname,
      query: {
        comment: id,
      },
    }),
    [id, pathname],
  );

  const renderCommentImageThumbnail = useMemo(
    () =>
      !!imageThumbnail && (
        <Box className={classes.imagePreviewContainer}>
          <Image
            className={classes.imagePreview}
            loader={mediaLoader}
            src={imageThumbnail}
            layout="fixed"
            width={40}
            height={40}
          />
        </Box>
      ),
    [classes.imagePreview, classes.imagePreviewContainer, imageThumbnail],
  );

  const renderMarkdownContent = useMemo(
    () =>
      !!commentPreview && (
        <Typography variant="subtitle1">
          <MarkdownContent dense>{commentPreview}</MarkdownContent>
        </Typography>
      ),
    [commentPreview],
  );

  const renderCommentPreview = useMemo(
    () => (
      <TableCell className={classes.tableCell}>
        {renderCommentImageThumbnail}
        {renderMarkdownContent}
      </TableCell>
    ),
    [classes.tableCell, renderCommentImageThumbnail, renderMarkdownContent],
  );

  const renderUserLink = useMemo(
    () => user?.slug && <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>,
    [user?.slug, user?.username],
  );

  const renderThreadLink = useMemo(() => <TextLink href={href}>{`#${thread?.slug}`}</TextLink>, [
    href,
    thread?.slug,
  ]);

  const renderCreatorInfo = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {t('common:postedBy')} {renderUserLink || t('common:communityUser')} {created} @{' '}
        {renderThreadLink}
      </Typography>
    ),
    [created, renderThreadLink, renderUserLink, t],
  );

  const renderCommentInfo = useMemo(
    () => (
      <Grid item xs={12} container direction="column">
        <TableCell className={classes.tableCell}>{renderCreatorInfo}</TableCell>
      </Grid>
    ),
    [classes.tableCell, renderCreatorInfo],
  );

  const renderMobileCommentStats = useMemo(
    () =>
      smDown && (
        <TableCell className={classes.tableCell}>
          <Typography variant="body2" color="textSecondary">
            {score} {scoreLabel} | {replyCount} {repliesLabel}
          </Typography>
        </TableCell>
      ),
    [classes.tableCell, repliesLabel, replyCount, score, scoreLabel, smDown],
  );

  const desktopStatsColSpan: ColSpan = useMemo(
    () => ({
      md: 3,
    }),
    [],
  );

  const renderDesktopCommentStats = useMemo(
    () => (
      <TableCell className={classes.tableCell}>
        <Grid container alignItems="center" justify="flex-end">
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
              <Typography variant="subtitle1">{replyCount}</Typography>
            </Grid>
            <Grid item md={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {repliesLabel}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
    ),
    [classes.tableCell, desktopStatsColSpan, repliesLabel, replyCount, score, scoreLabel],
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
    <Link href={href} key={key} fullWidth>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item {...mainColSpan} container>
                {renderCommentPreview}
                {renderCommentInfo}
              </Grid>
              <Grid item {...statsColSpan} container>
                {renderMobileCommentStats || renderDesktopCommentStats}
              </Grid>
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
