import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CommentOutlined from '@material-ui/icons/CommentOutlined';
import KeyboardArrowDownOutlined from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@material-ui/icons/KeyboardArrowUpOutlined';
import MoreHorizOutlined from '@material-ui/icons/MoreHorizOutlined';
import clsx from 'clsx';
import {
  useActionsContext,
  useAuthContext,
  useConfirmContext,
  useDiscussionContext,
  useNotificationsContext,
} from 'context';
import { CommentObjectType, DeleteCommentMutation, useDeleteCommentMutation } from 'generated';
import { useDayjs, useLanguageHeaderContext, useVotes } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useRef } from 'react';
import { BORDER } from 'theme';
import { mediaLoader, mediaUrl, truncate, urls } from 'utils';

import { MarkdownContent, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 0,
    overflow: 'visible',
    boxShadow: 'none',
    borderBottom: BORDER,
    position: 'relative',
  },
  noBorderBottom: {
    borderBottom: 'none',
  },
  replyComment: {
    borderLeft: `${spacing(1)} solid ${palette.primary.main}`,
  },
  cardHeader: {
    padding: 0,
    textAlign: 'left',
  },
  avatar: {
    width: '2rem',
    height: '2rem',
  },
  cardTitle: {
    fontSize: '1rem',
  },
  cardSubHeader: {
    fontSize: '0.75rem',
  },
  cardContent: {
    padding: `${spacing(3)} !important`,
  },
  messageContent: {
    padding: `${spacing(3)} 0`,
  },
  text: {
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  attachmentPreviewContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  attachmentPreview: {
    border: `0.1rem solid ${palette.primary.main} !important`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  icon: {
    marginRight: spacing(1),
  },
  iconButton: {
    padding: spacing(2),
  },
  replyCount: {
    marginRight: spacing(1),
    padding: spacing(2),
    paddingLeft: 0,
  },
  messageInfo: {
    // On reply comments without attachments, the message info has not buttons with relative positioning.
    // In this case we must ensure the element has the sufficient height to have the actions button positioned properly.
    minHeight: '2.35rem',
  },
  actionsButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: '0 auto',
    marginBottom: spacing(3),
    width: '2.35rem',
  },
}));

interface Props {
  comment: CommentObjectType;
  onCommentDeleted: () => void;
  topComment?: boolean;
  lastReply?: boolean;
}

export const CommentCard: React.FC<Props> = ({
  comment,
  onCommentDeleted,
  topComment,
  lastReply,
}) => {
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const commentRef = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const { t } = useTranslation();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const { confirm } = useConfirmContext();
  const { handleOpenActionsDialog } = useActionsContext();
  const avatarThumbnail = R.propOr('', 'avatarThumbnail', comment.user);
  const initialVote = R.propOr(null, 'vote', comment);
  const initialScore = String(R.propOr(0, 'score', comment));
  const creatorId = R.propOr('', 'id', comment.user);
  const isOwner = !!userMe && userMe.id === creatorId;
  const commentId = R.propOr('', 'id', comment);
  const replyComments = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { setAttachmentViewerValue } = useDiscussionContext();
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], comment);
  const commentPreview = truncate(comment.text, 20);
  const created = useDayjs(comment.created).startOf('m').fromNow();

  const {
    score,
    upvoteButtonProps,
    downvoteButtonProps,
    upvoteTooltip,
    downvoteTooltip,
  } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { comment: commentId },
    upvoteTooltip: t('discussion-tooltips:upvote'),
    removeUpvoteTooltip: t('discussion-tooltips:removeUpvote'),
    downvoteTooltip: t('discussion-tooltips:downvote'),
    removeDownvoteTooltip: t('discussion-tooltips:removeDownvote'),
    ownContentTooltip: t('discussion-tooltips:voteOwnContent'),
  });

  // If a comment has been provided as a query parameter, automatically scroll into the comment.
  useEffect(() => {
    if (query.comment === comment.id) {
      commentRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [query]);

  const handleClickAttachment = (): void => setAttachmentViewerValue(comment.attachment);

  const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
    if (deleteComment) {
      if (!!deleteComment.errors && !!deleteComment.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (deleteComment.successMessage) {
        onCommentDeleted();
        toggleNotification(deleteComment.successMessage);
      } else {
        toggleUnexpectedErrorNotification();
      }
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [deleteComment] = useDeleteCommentMutation({
    onCompleted: deleteCommentCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleDeleteComment = async (): Promise<void> => {
    try {
      await confirm({
        title: `${t('discussion:delete')}?`,
        description: t('discussion:confirmDelete'),
      });

      await deleteComment({ variables: { id: comment.id } });
    } catch {
      // User cancelled.
    }
  };

  const handleClickActionsButton = (e: SyntheticEvent) => {
    e.stopPropagation(); // Prevent opening comment thread for top-level comments.

    const shareDialogParams = {
      header: t('discussion:share'),
      title: t('discussion:shareTitle', { creatorUsername }),
      text: t('discussion:shareText', { creatorUsername, commentPreview }),
      linkSuffix: `?comment=${commentId}`,
    };

    const deleteActionParams = {
      text: t('discussion:delete'),
      callback: handleDeleteComment,
    };

    handleOpenActionsDialog({
      shareText: t('discussion:share'),
      shareDialogParams,
      hideDeleteAction: !isOwner,
      deleteActionParams,
    });
  };

  const renderTitle = comment.user ? (
    <TextLink
      href={urls.user(comment.user.id)}
      onClick={(e: SyntheticEvent): void => e.stopPropagation()}
    >
      {comment.user.username}
    </TextLink>
  ) : (
    <Typography variant="body2" color="textSecondary">
      {t('common:communityUser')}
    </Typography>
  );

  const renderCardHeader = (
    <CardHeader
      classes={{
        root: classes.cardHeader,
        title: classes.cardTitle,
        subheader: classes.cardSubHeader,
      }}
      avatar={<Avatar className={classes.avatar} src={mediaUrl(avatarThumbnail)} />}
      title={renderTitle}
      subheader={created}
    />
  );

  const renderAttachmentThumbnail = !!comment.attachmentThumbnail && (
    <Box className={classes.attachmentPreviewContainer}>
      <Tooltip title={t('discussion-tooltips:attachment')}>
        <Image
          className={classes.attachmentPreview}
          onClick={handleClickAttachment}
          loader={mediaLoader}
          src={comment.attachmentThumbnail}
          layout="fixed"
          width={60}
          height={60}
        />
      </Tooltip>
    </Box>
  );

  const renderText = (
    <Typography className={classes.text} variant="body2">
      <MarkdownContent>{comment.text}</MarkdownContent>
    </Typography>
  );

  const renderMessageContent = (
    <Grid className={classes.messageContent} container alignItems="center">
      {renderAttachmentThumbnail}
      {renderText}
    </Grid>
  );

  const renderReplyCount = topComment && (
    <Tooltip title={t('discussion-tooltips:replies', { replyCount })}>
      <Box display="flex" className={classes.replyCount}>
        <CommentOutlined className={classes.icon} color="disabled" />
        <Typography variant="body2" color="textSecondary">
          {replyCount}
        </Typography>
      </Box>
    </Tooltip>
  );

  const renderActionsButton = (
    <Tooltip title={t('discussion-tooltips:actions')}>
      <IconButton
        onClick={handleClickActionsButton}
        className={clsx(classes.iconButton, classes.actionsButton)}
        color="default"
      >
        <MoreHorizOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderMessageInfo = (
    <Grid className={classes.messageInfo} container alignItems="center">
      {renderReplyCount}
      {renderActionsButton}
    </Grid>
  );

  const renderUpvoteButton = (
    <Tooltip title={upvoteTooltip}>
      <Typography component="span">
        <IconButton className={classes.iconButton} {...upvoteButtonProps}>
          <KeyboardArrowUpOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderScore = <Typography variant="body2">{score}</Typography>;

  const renderDownvoteButton = (
    <Tooltip title={downvoteTooltip}>
      <Typography component="span">
        <IconButton className={classes.iconButton} {...downvoteButtonProps}>
          <KeyboardArrowDownOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderVoteButtons = (
    <Grid item container xs={2} sm={1} direction="column" justify="center" alignItems="center">
      {renderUpvoteButton}
      {renderScore}
      {renderDownvoteButton}
    </Grid>
  );

  const renderMessage = (
    <Grid item xs={10} sm={11}>
      <CardContent className={classes.cardContent}>
        {renderCardHeader}
        {renderMessageContent}
        {renderMessageInfo}
      </CardContent>
    </Grid>
  );

  return (
    <Card
      ref={commentRef}
      className={clsx(
        classes.root,
        !topComment && classes.replyComment,
        (topComment || lastReply) && classes.noBorderBottom,
      )}
    >
      <Grid container>
        {renderMessage}
        {renderVoteButtons}
      </Grid>
    </Card>
  );
};
