import React from 'react';
import {
  CardActionArea,
  Grid,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
  Chip,
} from '@material-ui/core';

import { AccountCircleOutlined, ChatOutlined, ThumbsUpDownOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import Link from 'next/link';
import { truncate, urls } from 'utils';

import { useDayjs } from 'hooks';
import { CommentObjectType } from 'generated';
import clsx from 'clsx';
import { MarkdownContent, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
  creatorLink: {
    marginRight: spacing(1),
  },
  commentPreview: {
    marginLeft: spacing(1),
  },
}));

interface Props {
  comment: CommentObjectType;
  key: number;
}

export const CommentTableRow: React.FC<Props> = ({
  comment: { id, text, attachment, created, score, replyCount, user, course, resource },
  key,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const renderCreated = useDayjs(created).startOf('day').fromNow();

  const commentPreview =
    (!!text && truncate(text, 40)) || (!!attachment && t('common:clickToView')) || '';

  const pathname =
    (!!course && urls.course(course.id)) || (!!resource && urls.resource(resource.id)) || '#';

  const href = {
    pathname,
    query: {
      comment: id,
    },
  };

  const renderScoreIcon = (
    <ThumbsUpDownOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderDiscussionIcon = <ChatOutlined className="table-row-icon" />;
  const renderUserIcon = <AccountCircleOutlined className="table-row-icon" />;
  const renderCommentChip = <Chip className="table-row-chip" label={t('common:comment')} />;
  const renderCourseChip = !!course && <Chip className="table-row-chip" label={course.name} />;

  const renderResourceChip = !!resource && (
    <Chip className="table-row-chip" label={resource.title} />
  );

  const renderCommentCreator = user ? (
    <TextLink className={classes.creatorLink} href={urls.user(user.id)} color="primary">
      {user.username}
    </TextLink>
  ) : (
    t('common:communityUser')
  );

  const renderCommentPreview = (
    <Grid container alignItems="center">
      <Typography variant="body2" color="textSecondary">
        <Grid container alignItems="center">
          {renderUserIcon} {renderCommentCreator} {renderCreated}:
        </Grid>
      </Typography>
      <Typography className={classes.commentPreview} variant="body2">
        <MarkdownContent>{commentPreview}</MarkdownContent>
      </Typography>
      <Typography className={classes.commentPreview} variant="body2">
        ...
      </Typography>
    </Grid>
  );

  const renderChips = (
    <Grid container>
      {renderCommentChip}
      {renderCourseChip}
      {renderResourceChip}
    </Grid>
  );

  const renderCommentInfo = (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {renderDiscussionIcon}
        {replyCount}
        {renderScoreIcon}
        {score}
      </Grid>
    </Typography>
  );

  return (
    <Link href={href} key={key}>
      <CardActionArea>
        <TableRow>
          <TableCell>
            {renderCommentPreview}
            {renderChips}
            {renderCommentInfo}
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
