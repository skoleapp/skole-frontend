import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { CommentObjectType } from 'generated';
import { useDayjs, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { BORDER } from 'theme';
import { truncate, urls } from 'utils';

import { MarkdownContent, TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    borderBottom: BORDER,
  },
  statsContainer: {
    display: 'flex',
  },
  mobileStatLabel: {
    marginLeft: spacing(2),
  },
  mobileReplyCount: {
    marginLeft: spacing(4),
  },
  commentPreview: {
    overflow: 'hidden',
    '& *': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}));

interface Props {
  comment: CommentObjectType;
  hideCommentChip?: boolean;
  key: number;
}

export const CommentTableRow: React.FC<Props> = ({
  comment: { id, text, attachment, created, score, replyCount, user, course, resource },
  hideCommentChip,
  key,
}) => {
  const { t } = useTranslation();
  const { isXsMobile, isMobile } = useMediaQueries();
  const classes = useStyles();
  const renderCreated = useDayjs(created).startOf('day').fromNow();
  const scoreLabel = t('common:score').toLowerCase();
  const repliesLabel = t('common:replies').toLowerCase();

  const commentPreview =
    (!!text && truncate(text, 200)) || (!!attachment && t('common:clickToView')) || '';

  const pathname =
    (!!course && urls.course(course.id)) || (!!resource && urls.resource(resource.id)) || '#';

  const href = {
    pathname,
    query: {
      comment: id,
    },
  };

  const renderCommentChip = !hideCommentChip && <TableRowChip label={t('common:comment')} />;
  const renderCourseChip = !!course && <TableRowChip label={course.name} />;
  const renderResourceChip = !!resource && <TableRowChip label={resource.title} />;

  const renderCommentCreator = user ? (
    <TextLink href={urls.user(user.id)} color="primary">
      {user.username}
    </TextLink>
  ) : (
    t('common:communityUser')
  );

  const renderMobileStats = isMobile && (
    <Grid container alignItems="center">
      <Typography variant="subtitle1">{score}</Typography>
      <Typography className={classes.mobileStatLabel} variant="body2" color="textSecondary">
        {scoreLabel}
      </Typography>
      <Typography className={classes.mobileReplyCount} variant="subtitle1">
        {replyCount}
      </Typography>
      <Typography className={classes.mobileStatLabel} variant="body2" color="textSecondary">
        {repliesLabel}
      </Typography>
    </Grid>
  );

  const renderDesktopStats = (
    <Grid container alignItems="center">
      <Grid item md={6} container>
        <Grid item md={12} container justify="center">
          <Typography variant="subtitle1">{score}</Typography>
        </Grid>
        <Grid item md={12} container justify="center">
          <Typography variant="body2" color="textSecondary">
            {scoreLabel}
          </Typography>
        </Grid>
      </Grid>
      <Grid item md={6} container>
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
  );

  const renderStats = renderMobileStats || renderDesktopStats;
  const renderCommentPreview = <MarkdownContent>{commentPreview}</MarkdownContent>;

  const renderCreatorInfo = (
    <Typography variant="body2" color="textSecondary" align={isXsMobile ? 'left' : 'right'}>
      {t('common:postedBy')} {renderCommentCreator} {renderCreated}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderCommentChip}
      {renderCourseChip}
      {renderResourceChip}
    </Grid>
  );

  return (
    <Link href={href} key={key}>
      <CardActionArea className={classes.root}>
        <TableRow>
          <Grid container>
            <Grid item xs={12} container>
              <Grid item xs={12} md={2} container>
                <TableCell className={classes.statsContainer}>{renderStats}</TableCell>
              </Grid>
              <Grid item xs={12} md={10} container>
                <TableCell className={classes.commentPreview}>{renderCommentPreview}</TableCell>
                <Hidden xsDown>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <TableCell>{renderChips}</TableCell>
                    </Grid>
                    <Grid item xs={12} sm={6} container justify="flex-end">
                      <TableCell>{renderCreatorInfo}</TableCell>
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
            <Hidden smUp>
              <Grid item xs={12} container>
                <TableCell>{renderChips}</TableCell>
              </Grid>
              <Grid item xs={12} container>
                <TableCell>{renderCreatorInfo}</TableCell>
              </Grid>
            </Hidden>
          </Grid>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
