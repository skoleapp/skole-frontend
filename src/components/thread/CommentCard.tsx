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
import MoreHorizOutlined from '@material-ui/icons/MoreHorizOutlined';
import clsx from 'clsx';
import {
  useActionsContext,
  useConfirmContext,
  useNotificationsContext,
  useThreadContext,
} from 'context';
import {
  BadgeObjectType,
  BadgeTier,
  CommentObjectType,
  DeleteCommentMutation,
  useDeleteCommentMutation,
  UserFieldsFragment,
  VoteObjectType,
} from 'generated';
import { useDayjs, useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mediaLoader, mediaUrl, truncate, urls } from 'utils';

import { BadgeTierIcon, MarkdownContent, TextLink } from '../shared';
import { VoteButton } from './VoteButton';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  replyComment: {
    borderLeft: `${spacing(1)} solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
  },
  cardHeaderRoot: {
    textAlign: 'left',
    padding: spacing(3),
    paddingBottom: 0,
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
  userLink: {
    marginRight: spacing(1),
  },
  subheaderText: {
    fontSize: '0.75rem',
  },
  subheaderEmoji: {
    fontSize: '0.5rem',
    marginLeft: spacing(1),
    marginRight: spacing(0.5),
  },
  creatorScore: {
    marginRight: spacing(1),
    fontWeight: 'bold',
  },
  score: {
    fontWeight: 'bold',
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
  replyCount: {
    marginRight: spacing(1),
    padding: spacing(2),
    paddingLeft: 0,
  },
  actionsButton: {
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
  const { confirm } = useConfirmContext();
  const { handleOpenActionsDialog } = useActionsContext();
  const [currentVote, setCurrentVote] = useState<VoteObjectType | null>(null);
  const [score, setScore] = useState(0);
  const avatarThumbnail = R.propOr('', 'avatarThumbnail', comment.user);
  const initialVote = R.prop('vote', comment);
  const initialScore = R.prop('score', comment);
  const commentId = R.prop('id', comment);
  const replyComments = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { setCommentImageViewerValue } = useThreadContext();
  const creator: UserFieldsFragment = R.prop('user', comment);
  const creatorUsername = R.propOr(t('common:communityUser'), 'username', creator);
  const creatorSlug = R.prop('slug', creator);
  const isOwn = R.prop('isOwn', comment);
  const commentPreview = truncate(comment.text, 20);
  const created = useDayjs(comment.created).startOf('m').fromNow();
  const badges: BadgeObjectType[] = R.propOr([], 'badges', creator);
  const diamondBadges = badges.filter((b) => b.tier === BadgeTier.Diamond);
  const goldBadges = badges.filter((b) => b.tier === BadgeTier.Gold);
  const silverBadges = badges.filter((b) => b.tier === BadgeTier.Silver);
  const bronzeBadges = badges.filter((b) => b.tier === BadgeTier.Bronze);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote, setCurrentVote]);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore, setScore]);

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
        hideDeleteAction: !isOwn,
        deleteActionParams,
      });
    },
    [
      commentId,
      commentPreview,
      creatorUsername,
      handleDeleteComment,
      handleOpenActionsDialog,
      isOwn,
      t,
    ],
  );

  const renderCreator = useMemo(
    () =>
      comment.user ? (
        <TextLink className={classes.userLink} href={urls.user(creatorSlug)}>
          {creatorUsername}
        </TextLink>
      ) : (
        t('common:communityUser')
      ),
    [comment.user, creatorSlug, creatorUsername, t, classes.userLink],
  );

  const renderCreatorTitle = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {renderCreator} {t('common:posted')} {created}
      </Typography>
    ),
    [renderCreator, created, t],
  );

  const renderBadgeTierIcon = useCallback(
    (tier: BadgeTier) => <BadgeTierIcon tier={tier} className={classes.subheaderEmoji} />,
    [classes.subheaderEmoji],
  );

  const renderDiamondBadgeCount = useMemo(
    () =>
      !!diamondBadges.length && (
        <>
          {renderBadgeTierIcon(BadgeTier.Diamond)}
          {diamondBadges.length}
        </>
      ),
    [diamondBadges.length, renderBadgeTierIcon],
  );

  const renderGoldBadgeCount = useMemo(
    () =>
      !!goldBadges.length && (
        <>
          {renderBadgeTierIcon(BadgeTier.Gold)}
          {goldBadges.length}
        </>
      ),
    [goldBadges.length, renderBadgeTierIcon],
  );

  const renderSilverBadgeCount = useMemo(
    () =>
      !!silverBadges.length && (
        <>
          {renderBadgeTierIcon(BadgeTier.Silver)}
          {silverBadges.length}
        </>
      ),
    [silverBadges.length, renderBadgeTierIcon],
  );

  const renderBronzeBadgeCount = useMemo(
    () =>
      !!bronzeBadges.length && (
        <>
          {renderBadgeTierIcon(BadgeTier.Bronze)}
          {bronzeBadges.length}
        </>
      ),
    [bronzeBadges.length, renderBadgeTierIcon],
  );

  const renderSubheader = useMemo(
    () =>
      !!creator && (
        <Grid container alignItems="center">
          <Typography className={clsx(classes.subheaderText, classes.creatorScore)} variant="body2">
            {creator.score}
          </Typography>
          <Typography className={classes.subheaderText} variant="body2">
            {renderDiamondBadgeCount} {renderGoldBadgeCount} {renderSilverBadgeCount}{' '}
            {renderBronzeBadgeCount}
          </Typography>
        </Grid>
      ),
    [
      creator,
      renderDiamondBadgeCount,
      renderGoldBadgeCount,
      renderSilverBadgeCount,
      renderBronzeBadgeCount,
      classes.creatorScore,
      classes.subheaderText,
    ],
  );

  const renderCardHeader = useMemo(
    () => (
      <CardHeader
        classes={{
          root: classes.cardHeaderRoot,
          content: classes.cardHeaderContent,
          title: classes.cardHeaderTitle,
        }}
        avatar={<Avatar className={classes.avatar} src={mediaUrl(avatarThumbnail)} />}
        title={renderCreatorTitle}
        subheader={renderSubheader}
      />
    ),
    [
      avatarThumbnail,
      classes.avatar,
      classes.cardHeaderContent,
      classes.cardHeaderRoot,
      classes.cardHeaderTitle,
      renderCreatorTitle,
      renderSubheader,
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
          className={classes.actionsButton}
          color="default"
          size="small"
        >
          <MoreHorizOutlined />
        </IconButton>
      </Tooltip>
    ),
    [classes.actionsButton, handleClickActionsButton, t],
  );

  const renderVoteButton = useCallback(
    (variant) => (
      <VoteButton
        currentVote={currentVote}
        setCurrentVote={setCurrentVote}
        setScore={setScore}
        variant={variant}
        isOwn={isOwn}
        variables={{ comment: commentId }}
      />
    ),
    [isOwn, commentId, currentVote],
  );

  const renderScore = useMemo(
    () => (
      <Typography
        className={classes.score}
        variant="subtitle1"
        color="textSecondary"
        align="center"
      >
        {score}
      </Typography>
    ),
    [score, classes.score],
  );

  const renderMessage = useMemo(
    () => (
      <CardContent className={classes.cardContent}>
        <Grid container>
          <Grid
            className={classes.messageContent}
            item
            xs={10}
            sm={11}
            container
            alignItems="center"
          >
            {renderImageThumbnail}
            {renderText}
          </Grid>
          <Grid
            item
            container
            xs={2}
            sm={1}
            direction="column"
            justify="center"
            alignItems="flex-end"
          >
            <Box display="flex" flexDirection="column">
              {renderVoteButton('upvote')}
              {renderScore}
              {renderVoteButton('downvote')}
            </Box>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            {renderReplyCount}
          </Grid>
          <Grid item xs={4} container justify="center">
            {renderActionsButton}
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </CardContent>
    ),
    [
      classes.cardContent,
      classes.messageContent,
      renderImageThumbnail,
      renderScore,
      renderText,
      renderVoteButton,
      renderActionsButton,
      renderReplyCount,
    ],
  );

  return (
    <Card ref={commentRef} className={clsx(classes.root, !topComment && classes.replyComment)}>
      {renderCardHeader}
      {renderMessage}
    </Card>
  );
};
