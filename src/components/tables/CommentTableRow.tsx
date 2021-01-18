import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import { CommentObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { truncate, urls } from 'utils';

import { MarkdownContent, TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';
import { TableRowIcon } from './TableRowIcon';

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

  const renderScoreIcon = <TableRowIcon icon={ThumbsUpDownOutlined} marginLeft />;
  const renderDiscussionIcon = <TableRowIcon icon={ChatOutlined} />;
  const renderUserIcon = <TableRowIcon icon={AccountCircleOutlined} />;
  const renderCommentChip = <TableRowChip label={t('common:comment')} />;
  const renderCourseChip = !!course && <TableRowChip label={course.name} />;
  const renderResourceChip = !!resource && <TableRowChip label={resource.title} />;

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
