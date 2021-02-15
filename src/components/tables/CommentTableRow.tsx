import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { CommentObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React from 'react';
import { BORDER } from 'styles';
import { ColSpan, TableRowProps } from 'types';
import { mediaLoader, truncate, urls } from 'utils';

import { Link, MarkdownContent, TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
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
  creatorInfoTableCell: {
    [breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  attachmentPreviewContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  attachmentPreview: {
    border: `0.1rem solid ${palette.primary.main} !important`,
    borderRadius: '0.5rem',
  },
  creatorInfo: {
    display: 'flex',
  },
  creator: {
    margin: `0 ${spacing(1)}`,
  },
}));

interface Props extends TableRowProps {
  comment: CommentObjectType;
  hideCommentChip?: boolean;
}

export const CommentTableRow: React.FC<Props> = ({
  comment: {
    id,
    text,
    attachmentThumbnail,
    created: _created,
    score,
    replyCount,
    user,
    course,
    resource,
    school,
    comment,
  },
  hideCommentChip,
  dense,
  key,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const created = useDayjs(_created).startOf('day').fromNow();
  const scoreLabel = t('common:score').toLowerCase();
  const repliesLabel = t('common:replies').toLowerCase();
  const commentPreview = !!text && truncate(text, 50);

  const pathname =
    (!!course?.slug && urls.course(course.slug)) ||
    (!!resource?.slug && urls.resource(resource.slug)) ||
    (!!school?.slug && urls.resource(school.slug)) ||
    (!!comment?.course?.slug && urls.course(comment.course.slug)) ||
    (!!comment?.resource?.slug && urls.resource(comment.resource.slug)) ||
    (!!comment?.school?.slug && urls.resource(comment.school.slug)) ||
    '';

  const href = {
    pathname,
    query: {
      comment: id,
    },
  };

  const renderCommentChip = !hideCommentChip && <TableRowChip label={t('common:comment')} />;

  const renderCourseChip = (!!course || comment?.course) && (
    <TableRowChip label={course?.name || comment?.course?.name} />
  );

  const renderResourceChip = (!!resource || comment?.resource) && (
    <TableRowChip label={resource?.title || comment?.resource?.title} />
  );

  const renderSchoolChip = (!!school || comment?.school) && (
    <TableRowChip label={school?.name || comment?.school?.name} />
  );

  const renderReplyChip = !!comment && <TableRowChip label={t('common:reply')} />;

  const renderUserLink = user?.slug && (
    <TextLink href={urls.user(user.slug)}>{user.username}</TextLink>
  );

  const renderCommentCreator = (
    <span className={classes.creator}>{renderUserLink || t('common:communityUser')}</span>
  );

  const renderMobileCommentStats = isMobile && (
    <TableCell className={classes.tableCell}>
      <Grid container spacing={4}>
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
              {repliesLabel}
            </Typography>
          </Grid>
          <Grid item xs={4} sm={2} container alignItems="center" justify="flex-end">
            <Typography variant="subtitle1">{replyCount}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </TableCell>
  );

  const desktopStatsColSpan: ColSpan = {
    md: dense ? 6 : 3,
    lg: 3,
  };

  const renderDesktopCommentStats = (
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
  );

  const renderCommentAttachmentThumbnail = !!attachmentThumbnail && (
    <Box className={classes.attachmentPreviewContainer}>
      <Image
        className={classes.attachmentPreview}
        loader={mediaLoader}
        src={attachmentThumbnail}
        layout="fixed"
        width={40}
        height={40}
      />
    </Box>
  );

  const renderMarkdownContent = !!commentPreview && (
    <Typography variant="subtitle1">
      <MarkdownContent>{commentPreview}</MarkdownContent>
    </Typography>
  );

  const renderCommentPreview = (
    <TableCell className={classes.tableCell}>
      {renderCommentAttachmentThumbnail}
      {renderMarkdownContent}
    </TableCell>
  );

  const renderCreatorInfo = (
    <Typography className={classes.creatorInfo} variant="body2" color="textSecondary">
      {t('common:postedBy')} {renderCommentCreator} {created}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderCommentChip}
      {renderCourseChip}
      {renderResourceChip}
      {renderSchoolChip}
      {renderReplyChip}
    </Grid>
  );

  const commentInfoColSpan: ColSpan = {
    xs: 12,
    md: dense ? 12 : 6,
  };

  const renderCommentInfo = (
    <Grid item xs={12} container alignItems="flex-end">
      <Grid item {...commentInfoColSpan}>
        <TableCell className={classes.tableCell}>{renderChips}</TableCell>
      </Grid>
      <Grid item {...commentInfoColSpan} container>
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
