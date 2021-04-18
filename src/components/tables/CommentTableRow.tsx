import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { CommentObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { BORDER, useMediaQueries } from 'styles';
import { mediaLoader, truncate, urls } from 'utils';

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
  textPreviewTableCell: {
    paddingBottom: 0,
    overflow: 'hidden',
    '& *': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
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
  threadLink: {
    whiteSpace: 'nowrap',
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
  const { smDown, mdUp } = useMediaQueries();
  const classes = useStyles();
  const created = useDayjs(_created).startOf('day').fromNow();
  const scoreLabel = t('common:score').toLowerCase();
  const repliesLabel = t('common:replies').toLowerCase();
  const textPreview = !!text && truncate(text, 50);
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
      !!textPreview && (
        <TableCell className={classes.tableCell}>
          <Typography variant="body2">
            <MarkdownContent dense>{textPreview}</MarkdownContent>
          </Typography>
        </TableCell>
      ),
    [classes.tableCell, textPreview],
  );

  const renderUserLink = useMemo(
    () => user?.slug && <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>,
    [user?.slug, user?.username],
  );

  const renderThreadLink = useMemo(
    () => <TextLink className={classes.threadLink} href={href}>{`@${thread?.slug}`}</TextLink>,
    [href, thread?.slug, classes.threadLink],
  );

  const renderDesktopThreadLink = useMemo(() => mdUp && <> {renderThreadLink}</>, [
    mdUp,
    renderThreadLink,
  ]);

  const renderCreatorInfo = useMemo(
    () => (
      <TableCell className={clsx(classes.tableCell, classes.creatorInfoTableCell)}>
        <Typography variant="body2" color="textSecondary">
          {t('common:postedBy')} {renderUserLink || t('common:anonymousStudent')} {created}
          {renderDesktopThreadLink}
        </Typography>
      </TableCell>
    ),
    [
      classes.tableCell,
      classes.creatorInfoTableCell,
      created,
      renderUserLink,
      t,
      renderDesktopThreadLink,
    ],
  );

  const renderMobileCommentStats = useMemo(
    () =>
      smDown && (
        <TableCell className={classes.tableCell}>
          <Typography variant="body2" color="textSecondary">
            {score} {scoreLabel} | {replyCount} {repliesLabel} | {renderThreadLink}
          </Typography>
        </TableCell>
      ),
    [classes.tableCell, repliesLabel, replyCount, score, scoreLabel, smDown, renderThreadLink],
  );

  const renderDesktopCommentStats = useMemo(
    () => (
      <TableCell className={classes.tableCell}>
        <Grid container alignItems="center" justify="flex-end">
          <Grid item xs={6} container>
            <Grid item xs={12} container justify="center">
              <Typography variant="subtitle1">{score}</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {scoreLabel}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container>
            <Grid item xs={12} container justify="center">
              <Typography variant="subtitle1">{replyCount}</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
              <Typography variant="body2" color="textSecondary">
                {repliesLabel}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </TableCell>
    ),
    [classes.tableCell, repliesLabel, replyCount, score, scoreLabel],
  );

  return (
    <Link href={href} key={key} fullWidth>
      <CardActionArea>
        <TableRow className={classes.root}>
          <Grid container>
            <Grid item xs={12} md={10} container wrap="nowrap">
              <Grid item container direction="column">
                {renderTextPreview}
                {renderCreatorInfo}
              </Grid>
              <Grid className={classes.imageThumbnailContainer} item container>
                {renderImageThumbnail}
              </Grid>
            </Grid>
            <Grid item xs={12} md={2} container>
              {renderMobileCommentStats || renderDesktopCommentStats}
            </Grid>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
