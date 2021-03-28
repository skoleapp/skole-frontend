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
  useNotificationsContext,
  useThreadContext,
} from 'context';
import { CommentObjectType, DeleteCommentMutation, useDeleteCommentMutation } from 'generated';
import { useDayjs, useLanguageHeaderContext, useVotes } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { mediaLoader, mediaUrl, truncate, urls } from 'utils';

import { MarkdownContent, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 0,
    overflow: 'visible',
    boxShadow: 'none',
    position: 'relative',
    maxWidth: '100vw',
  },
  replyComment: {
    borderLeft: `${spacing(1)} solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
  },
  cardHeaderRoot: {
    padding: 0,
    textAlign: 'left',
  },
  cardHeaderContent: {
    overflow: 'hidden',
  },
  avatar: {
    width: '2rem',
    height: '2rem',
  },
  cardHeaderTitle: {
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  },
  cardHeaderSubheader: {
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
  imagePreviewContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  imagePreview: {
    border: `0.1rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    } !important`,
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
    // On reply comments without images, the message info has not buttons with relative positioning.
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
}

export const CommentCard: React.FC<Props> = ({ comment, onCommentDeleted, topComment }) => {
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const commentRef = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const { t } = useTranslation();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const { confirm } = useConfirmContext();
  const { handleOpenActionsDialog } = useActionsContext();
  const avatarThumbnail = R.prop('avatarThumbnail', comment.user);
  const initialVote = R.prop('vote', comment);
  const initialScore = R.prop('score', comment);
  const commentId = R.prop('id', comment);
  const replyComments = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { setCommentImageViewerValue } = useThreadContext();
  const creator = R.prop('user', comment);
  const creatorUsername = R.propOr(t('common:communityUser'), 'username', creator);
  const creatorSlug = R.prop('slug', creator);
  const isOwner = !!creator && userMe?.id === creator.id;
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
    upvoteTooltip: t('thread-tooltips:upvoteComment'),
    removeUpvoteTooltip: t('thread-tooltips:removeCommentUpvote'),
    downvoteTooltip: t('thread-tooltips:downvoteComment'),
    removeDownvoteTooltip: t('thread-tooltips:removeCommentDownvote'),
  });

  // If a comment has been provided as a query parameter, automatically scroll into the comment.
  useEffect(() => {
    if (query.comment === comment.id) {
      commentRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [query, comment.id]);

  const handleClickImage = useCallback((): void => setCommentImageViewerValue(comment.image), [
    comment.image,
    setCommentImageViewerValue,
  ]);

  const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
    if (deleteComment?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (deleteComment?.successMessage) {
      onCommentDeleted();
      toggleNotification(deleteComment.successMessage);
      sa_event('delete_comment');
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [deleteComment] = useDeleteCommentMutation({
    onCompleted: deleteCommentCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleDeleteComment = useCallback(async (): Promise<void> => {
    try {
      await confirm({
        title: `${t('thread:deleteComment')}?`,
        description: t('thread:confirmDeleteComment'),
      });

      await deleteComment({ variables: { id: comment.id } });
    } catch {
      // User cancelled.
    }
  }, [comment.id, confirm, deleteComment, t]);

  const handleClickActionsButton = useCallback(
    (e: SyntheticEvent): void => {
      e.stopPropagation(); // Prevent opening comment thread for top-level comments.

      const shareDialogParams = {
        header: t('thread:shareComment'),
        title: t('thread:shareCommentTitle', { creatorUsername }),
        text: commentPreview,
        linkSuffix: `?comment=${commentId}`,
      };

      const deleteActionParams = {
        text: t('thread:deleteComment'),
        callback: handleDeleteComment,
      };

      handleOpenActionsDialog({
        shareText: t('thread:shareComment'),
        shareDialogParams,
        hideDeleteAction: !isOwner,
        deleteActionParams,
      });
    },
    [
      commentId,
      commentPreview,
      creatorUsername,
      handleDeleteComment,
      handleOpenActionsDialog,
      isOwner,
      t,
    ],
  );

  const renderCreator = useMemo(
    () =>
      comment.user ? (
        <TextLink href={urls.user(creatorSlug)}>{creatorUsername}</TextLink>
      ) : (
        t('common:communityUser')
      ),
    [comment.user, creatorSlug, creatorUsername, t],
  );

  const renderCreatorTitle = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {renderCreator}
      </Typography>
    ),
    [renderCreator],
  );

  const renderCardHeader = useMemo(
    () => (
      <CardHeader
        classes={{
          root: classes.cardHeaderRoot,
          content: classes.cardHeaderContent,
          title: classes.cardHeaderTitle,
          subheader: classes.cardHeaderSubheader,
        }}
        avatar={<Avatar className={classes.avatar} src={mediaUrl(avatarThumbnail)} />}
        title={renderCreatorTitle}
        subheader={created}
      />
    ),
    [
      avatarThumbnail,
      classes.avatar,
      classes.cardHeaderContent,
      classes.cardHeaderRoot,
      classes.cardHeaderSubheader,
      classes.cardHeaderTitle,
      created,
      renderCreatorTitle,
    ],
  );

  const renderImageThumbnail = useMemo(
    () =>
      !!comment.imageThumbnail && (
        <Tooltip title={t('thread-tooltips:commentImage')}>
          <Box className={classes.imagePreviewContainer}>
            <Image
              className={classes.imagePreview}
              onClick={handleClickImage}
              loader={mediaLoader}
              src={comment.imageThumbnail}
              layout="fixed"
              width={60}
              height={60}
            />
          </Box>
        </Tooltip>
      ),
    [
      classes.imagePreview,
      classes.imagePreviewContainer,
      comment.imageThumbnail,
      handleClickImage,
      t,
    ],
  );

  const renderText = useMemo(
    () => (
      <Typography className={classes.text} variant="body2">
        <MarkdownContent>{comment.text}</MarkdownContent>
      </Typography>
    ),
    [classes.text, comment.text],
  );

  const renderMessageContent = useMemo(
    () => (
      <Grid className={classes.messageContent} container alignItems="center">
        {renderImageThumbnail}
        {renderText}
      </Grid>
    ),
    [classes.messageContent, renderImageThumbnail, renderText],
  );

  const renderReplyCount = useMemo(
    () =>
      topComment && (
        <Tooltip title={t('thread-tooltips:commentReplies', { replyCount })}>
          <Box display="flex" className={classes.replyCount}>
            <CommentOutlined className={classes.icon} color="disabled" />
            <Typography variant="body2" color="textSecondary">
              {replyCount}
            </Typography>
          </Box>
        </Tooltip>
      ),
    [classes.icon, classes.replyCount, replyCount, t, topComment],
  );

  const renderActionsButton = useMemo(
    () => (
      <Tooltip title={t('thread-tooltips:commentActions')}>
        <IconButton
          onClick={handleClickActionsButton}
          className={clsx(classes.iconButton, classes.actionsButton)}
          color="default"
        >
          <MoreHorizOutlined />
        </IconButton>
      </Tooltip>
    ),
    [classes.actionsButton, classes.iconButton, handleClickActionsButton, t],
  );

  const renderMessageInfo = useMemo(
    () => (
      <Grid className={classes.messageInfo} container alignItems="center">
        {renderReplyCount}
        {renderActionsButton}
      </Grid>
    ),
    [classes.messageInfo, renderActionsButton, renderReplyCount],
  );

  const renderUpvoteButton = useMemo(
    () => (
      <Tooltip title={upvoteTooltip}>
        <Typography component="span">
          <IconButton className={classes.iconButton} {...upvoteButtonProps}>
            <KeyboardArrowUpOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
    ),
    [classes.iconButton, upvoteButtonProps, upvoteTooltip],
  );

  const renderScore = useMemo(() => <Typography variant="body2">{score}</Typography>, [score]);

  const renderDownvoteButton = useMemo(
    () => (
      <Tooltip title={downvoteTooltip}>
        <Typography component="span">
          <IconButton className={classes.iconButton} {...downvoteButtonProps}>
            <KeyboardArrowDownOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
    ),
    [classes.iconButton, downvoteButtonProps, downvoteTooltip],
  );

  const renderVoteButtons = useMemo(
    () => (
      <Grid item container xs={2} sm={1} direction="column" justify="center" alignItems="center">
        {renderUpvoteButton}
        {renderScore}
        {renderDownvoteButton}
      </Grid>
    ),
    [renderDownvoteButton, renderScore, renderUpvoteButton],
  );

  const renderMessage = useMemo(
    () => (
      <Grid item xs={10} sm={11}>
        <CardContent className={classes.cardContent}>
          {renderCardHeader}
          {renderMessageContent}
          {renderMessageInfo}
        </CardContent>
      </Grid>
    ),
    [classes.cardContent, renderCardHeader, renderMessageContent, renderMessageInfo],
  );

  return (
    <Card ref={commentRef} className={clsx(classes.root, !topComment && classes.replyComment)}>
      <Grid container>
        {renderMessage}
        {renderVoteButtons}
      </Grid>
    </Card>
  );
};
