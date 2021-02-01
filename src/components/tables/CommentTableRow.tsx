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
import Link from 'next/link';
import React from 'react';
import { BORDER } from 'theme';
import { ColSpan, TableRowProps } from 'types';
import { truncate, urls } from 'utils';

import { MarkdownContent, TextLink } from '../shared';
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
}));

interface Props extends TableRowProps {
  comment: CommentObjectType;
  hideCommentChip?: boolean;
}

export const CommentTableRow: React.FC<Props> = ({
  comment: {
    id,
    text,
    attachment,
    created: _created,
    score,
    replyCount,
    user,
    course,
    resource,
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

  const commentPreview =
    (!!text && truncate(text, 50)) || (!!attachment && t('common:clickToView')) || '';

  const pathname =
    (!!course && urls.course(course.id)) ||
    (!!resource && urls.resource(resource.id)) ||
    (!!comment && !!comment.course && urls.course(comment.course.id)) ||
    (!!comment && !!comment.resource && urls.resource(comment.resource.id)) ||
    '';

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

  const renderCommentPreview = (
    <TableCell className={classes.tableCell}>
      <MarkdownContent>{commentPreview}</MarkdownContent>
    </TableCell>
  );

  const renderCreatorInfo = (
    <Typography variant="body2" color="textSecondary">
      {t('common:postedBy')} {renderCommentCreator} {created}
    </Typography>
  );

  const renderChips = (
    <Grid container>
      {renderCommentChip}
      {renderCourseChip}
      {renderResourceChip}
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
    <Link href={href} key={key}>
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
