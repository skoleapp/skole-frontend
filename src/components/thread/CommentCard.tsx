import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import {
  useConfirmContext,
  useNotificationsContext,
  useShareContext,
  useThreadContext,
} from 'context';
import {
  BadgeObjectType,
  BadgeTier,
  CommentObjectType,
  DeleteCommentMutation,
  useDeleteCommentMutation,
  UserObjectType,
  VoteObjectType,
} from 'generated';
import { useDayjs, useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mediaLoader, mediaUrl, truncate, urls } from 'utils';

import { BadgeTierIcon, ExternalLink, MarkdownContent, TextLink } from '../shared';
import { VoteButton } from './VoteButton';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  replyComment: {
    paddingLeft: spacing(4),
  },
  replyCommentBorder: {
    borderLeft: `${spacing(1)} solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
    paddingLeft: spacing(2),
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
  messageContent: {
    padding: `${spacing(2)} ${spacing(3)}`,
  },
  text: {
    overflow: 'hidden',
    wordBreak: 'break-word',
    fontSize: '0.95rem',
  },
  attachmentThumbnailContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  attachmentThumbnail: {
    border: `0.1rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    } !important`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  actions: {
    padding: `0 ${spacing(3)}`,
  },
  voteButtons: {
    paddingRight: spacing(3),
  },
  actionsText: {
    marginRight: spacing(1),
  },
  button: {
    padding: `${spacing(0.25)} ${spacing(1)}`,
    minWidth: 'auto',
    color: palette.text.secondary,
    textTransform: 'unset',
    marginRight: spacing(1),
    borderRadius: '0.25rem',
  },
}));

interface Props {
  comment: CommentObjectType;
  onCommentDeleted: () => void;
  topComment?: boolean;
  handleClickReplyButton?: (comment: CommentObjectType) => void;
}

export const CommentCard: React.FC<Props> = ({
  comment,
  onCommentDeleted,
  topComment,
  handleClickReplyButton,
}) => {
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const commentRef = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const { t } = useTranslation();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const { handleOpenShareDialog } = useShareContext();
  const [currentVote, setCurrentVote] = useState<VoteObjectType | null>(null);
  const [score, setScore] = useState(0);
  const avatarThumbnail: string = R.propOr('', 'avatarThumbnail', comment.user);
  const initialVote: VoteObjectType = R.propOr(null, 'vote', comment);
  const initialScore: number = R.propOr(0, 'score', comment);
  const commentId = R.prop('id', comment);
  const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { setCommentImageViewerValue } = useThreadContext();
  const creator: UserObjectType = R.propOr(null, 'user', comment);
  const creatorUsername: string = R.propOr(t('common:anonymousStudent'), 'username', creator);
  const creatorSlug: string = R.propOr('', 'slug', creator);
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

  const handleClickDeleteButton = useCallback(async (): Promise<void> => {
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

  const handleClickShareButton = useCallback(
    (): void =>
      handleOpenShareDialog({
        header: t('thread:shareComment'),
        title: t('thread:shareCommentTitle', { creatorUsername }),
        text: commentPreview,
        linkSuffix: `?comment=${commentId}`,
      }),
    [commentId, commentPreview, creatorUsername, handleOpenShareDialog, t],
  );

  const renderCreator = useMemo(
    () =>
      comment.user ? (
        <TextLink className={classes.userLink} href={urls.user(creatorSlug)}>
          {creatorUsername}
        </TextLink>
      ) : (
        t('common:anonymousStudent')
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

  const renderImageThumbnail = useMemo(
    () =>
      !!comment.imageThumbnail && (
        <Tooltip title={t('thread-tooltips:commentImage')}>
          <Box className={classes.attachmentThumbnailContainer}>
            <Image
              className={classes.attachmentThumbnail}
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
      classes.attachmentThumbnail,
      classes.attachmentThumbnailContainer,
      comment.imageThumbnail,
      handleClickImage,
      t,
    ],
  );

  const renderFileThumbnail = useMemo(
    () =>
      !!comment.fileThumbnail && (
        <Tooltip title={t('thread-tooltips:commentFile')}>
          <Box className={classes.attachmentThumbnailContainer}>
            <ExternalLink href={mediaUrl(comment.file)}>
              <Image
                className={classes.attachmentThumbnail}
                loader={mediaLoader}
                src={comment.fileThumbnail}
                layout="fixed"
                width={60}
                height={60}
              />
            </ExternalLink>
          </Box>
        </Tooltip>
      ),
    [
      classes.attachmentThumbnail,
      classes.attachmentThumbnailContainer,
      comment.file,
      comment.fileThumbnail,
      t,
    ],
  );

  const renderThumbnail = renderImageThumbnail || renderFileThumbnail;

  const renderText = useMemo(
    () => (
      <Typography className={classes.text} variant="body2">
        <MarkdownContent dense>{comment.text}</MarkdownContent>
      </Typography>
    ),
    [classes.text, comment.text],
  );

  const renderReplyCount = useMemo(
    () =>
      topComment && (
        <Typography className={classes.actionsText} variant="body2" color="textSecondary">
          {t('thread:commentReplies', { replyCount })}
        </Typography>
      ),
    [replyCount, t, topComment, classes.actionsText],
  );

  const renderReplyButton = useMemo(
    () =>
      !!handleClickReplyButton && (
        <Button
          onClick={(): void => handleClickReplyButton(comment)}
          className={classes.button}
          color="default"
        >
          {t('common:reply')}
        </Button>
      ),
    [classes.button, t, handleClickReplyButton, comment],
  );

  const renderShareButton = useMemo(
    () => (
      <Button onClick={handleClickShareButton} className={classes.button} color="default">
        {t('common:share')}
      </Button>
    ),
    [classes.button, handleClickShareButton, t],
  );

  const renderDeleteButton = useMemo(
    () =>
      !!isOwn && (
        <Button onClick={handleClickDeleteButton} className={classes.button} color="default">
          {t('common:delete')}
        </Button>
      ),
    [classes.button, handleClickDeleteButton, t, isOwn],
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

  const renderAttachmentAndText = useMemo(
    () =>
      (!!comment.text || !!renderThumbnail) && (
        <Grid item xs={12} className={classes.messageContent} container alignItems="center">
          {renderThumbnail}
          {renderText}
        </Grid>
      ),
    [classes.messageContent, comment.text, renderThumbnail, renderText],
  );

  const renderButtons = useMemo(
    () => (
      <Grid item xs={12} className={classes.actions} container alignItems="center">
        {renderReplyCount}
        {renderReplyButton}
        {renderShareButton}
        {renderDeleteButton}
      </Grid>
    ),
    [classes.actions, renderDeleteButton, renderReplyButton, renderReplyCount, renderShareButton],
  );

  return (
    <Card ref={commentRef} className={clsx(classes.root, !topComment && classes.replyComment)}>
      <Grid container>
        <Grid
          className={clsx(!topComment && classes.replyCommentBorder)}
          item
          xs={10}
          sm={11}
          container
        >
          {renderCardHeader}
          {renderAttachmentAndText}
          {renderButtons}
        </Grid>
        <Grid
          item
          container
          xs={2}
          sm={1}
          className={classes.voteButtons}
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
    </Card>
  );
};
