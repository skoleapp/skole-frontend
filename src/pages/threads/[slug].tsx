import BottomNavigation from '@material-ui/core/BottomNavigation';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddOutlined from '@material-ui/icons/AddOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import clsx from 'clsx';
import {
  ActionRequiredTemplate,
  ActionsButton,
  CommentCard,
  CreateCommentForm,
  Emoji,
  ErrorTemplate,
  InfoButton,
  LoadingBox,
  LoadingTemplate,
  LoginRequiredTemplate,
  MainTemplate,
  NotFoundBox,
  OrderingButton,
  PaginatedTable,
  ShareButton,
} from 'components';
import {
  useAuthContext,
  useConfirmContext,
  useDarkModeContext,
  useNotificationsContext,
  useOrderingContext,
  useThreadContext,
} from 'context';
import {
  CommentObjectType,
  DeleteThreadMutation,
  StarMutation,
  ThreadObjectType,
  useDeleteThreadMutation,
  useStarMutation,
  useThreadCommentsLazyQuery,
  useThreadLazyQuery,
} from 'generated';
import { withActions, withInfo, withThread, withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useVotes } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BORDER_RADIUS, BOTTOM_NAVBAR_HEIGHT } from 'styles';
import { MAX_REVALIDATION_INTERVAL, mediaLoader, urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  containerPadding: {
    [breakpoints.down('sm')]: {
      paddingBottom: spacing(18), // Make room for the create comment button on mobile.
    },
  },
  backButton: {
    marginRight: spacing(2),
  },
  headerTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    marginLeft: spacing(2),
  },
  score: {
    marginLeft: spacing(2),
    marginRight: spacing(2),
  },
  imageThumbnailContainer: {
    marginRight: spacing(3),
    display: 'flex',
  },
  imageThumbnail: {
    border: `0.1rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    } !important`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  commentsHeader: {
    padding: spacing(2),
  },
  replyButtonContainer: {
    padding: spacing(2),
  },
  createCommentButton: {
    position: 'fixed',
    bottom: `calc(${spacing(4)} + ${BOTTOM_NAVBAR_HEIGHT} + env(safe-area-inset-bottom))`,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    opacity: 0.7,
  },
}));

const ThreadPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const { mdUp, smDown } = useMediaQueries();
  const { query } = useRouter();
  const { userMe, verified } = useAuthContext();
  const context = useLanguageHeaderContext();
  const threadVariables = R.pick(['slug'], query);
  const commentQueryVariables = R.pick(['slug', 'page', 'pageSize'], query);
  const { ordering } = useOrderingContext();

  const commentVariables = {
    ordering,
    ...commentQueryVariables,
  };

  const [
    threadQuery,
    {
      data: threadData,
      loading: threadLoading,
      error: threadError,
      previousData: previousThreadQueryData,
    },
  ] = useThreadLazyQuery({ variables: threadVariables, context });

  const [
    commentsQuery,
    { data: commentsData, loading: commentsLoading, error: commentsError },
  ] = useThreadCommentsLazyQuery({ variables: commentVariables, context });

  const error = threadError || commentsError;
  const thread = R.prop('thread', threadData);
  const comments: CommentObjectType[] = R.pathOr([], ['comments', 'objects'], commentsData);
  const id = R.prop('id', thread);
  const title = R.prop('title', thread);
  const text = R.prop('text', thread);
  const image = R.prop('image', thread);
  const imageThumbnail = R.prop('imageThumbnail', thread);
  const initialScore = R.prop('score', thread);
  const initialStars = R.prop('starCount', thread);
  const commentCount = R.propOr(0, 'commentCount', thread);
  const initialVote = R.prop('vote', thread);
  const initialStarred = R.prop('starred', thread);
  const creator = R.prop('user', thread);
  const isOwner = !!creator && userMe?.id === creator.id;
  const created = R.prop('created', thread);
  const creatorUsername = R.propOr(t('common:communityUser'), 'username', thread);
  const emoji = '💬';
  const [targetComment, setTargetComment] = useState<CommentObjectType | null>(null);
  const [targetThread, setTargetThread] = useState<ThreadObjectType | null>(null);
  const { dynamicPrimaryColor } = useDarkModeContext();
  const [stars, setStars] = useState('0');
  const [starred, setStarred] = useState(false);
  const tooltip = starred ? t('thread-tooltips:unstarThread') : t('thread-tooltips:starThread'); // Show a dynamic tooltip based on the starred status.

  const {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    setThreadImageViewerValue,
  } = useThreadContext();

  const { renderUpvoteButton, renderDownvoteButton, score } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { thread: id },
    upvoteTooltip: t('thread-tooltips:upvoteThread'),
    removeUpvoteTooltip: t('thread-tooltips:removeThreadUpvote'),
    downvoteTooltip: t('thread-tooltips:downvoteThread'),
    removeDownvoteTooltip: t('thread-tooltips:removeThreadDownvote'),
  });

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  useEffect(() => {
    setStars(initialStars);
  }, [initialStars]);

  // Fetch initial data for thread and comments.
  useEffect(() => {
    threadQuery();

    if (verified) {
      commentsQuery();
    }
  }, [threadQuery, commentsQuery, verified]);

  // Set the target thread state whenever mounting or the create comment dialog is closed,
  useEffect(() => {
    if (!createCommentDialogOpen) {
      setTargetThread(thread);
    }
  }, [createCommentDialogOpen, thread]);

  const deleteThreadCompleted = async ({ deleteThread }: DeleteThreadMutation): Promise<void> => {
    if (deleteThread?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (deleteThread?.successMessage) {
      toggleNotification(deleteThread.successMessage);
      await Router.push(urls.home);
      sa_event('delete_thread');
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [deleteThread] = useDeleteThreadMutation({
    onCompleted: deleteThreadCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleDeleteThread = useCallback(async (): Promise<void> => {
    try {
      await confirm({
        title: `${t('thread:deleteThread')}?`,
        description: t('thread:confirmDeleteThread'),
      });

      await deleteThread({ variables: { id } });
    } catch {
      // User cancelled.
    }
  }, [confirm, deleteThread, id, t]);

  const starCompleted = ({ star }: StarMutation): void => {
    if (star?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (star) {
      setStarred(!!star.starred);
      setStars(String(Number(stars) + (star.starred ? 1 : -1)));
    }
  };

  const [star, { loading: starSubmitting }] = useStarMutation({
    onCompleted: starCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleStar = useCallback(async (): Promise<void> => {
    await star({ variables: { thread: id } });
  }, [star, id]);

  const infoItems = useMemo(
    () => [
      {
        label: t('common:stars'),
        value: stars,
      },
      {
        label: t('common:score'),
        value: score,
      },
      {
        label: t('common:comments'),
        value: commentCount,
      },
    ],
    [commentCount, score, stars, t],
  );

  // Only render for verified users.
  const renderStarButton = useMemo(
    () =>
      !!verified && (
        <Tooltip title={tooltip}>
          <Typography component="span">
            <Button
              onClick={handleStar}
              disabled={starSubmitting}
              size="small"
              startIcon={<StarBorderOutlined color={starred ? dynamicPrimaryColor : 'disabled'} />}
            >
              <Typography
                variant="subtitle1"
                color={starred ? dynamicPrimaryColor : 'textSecondary'}
              >
                {stars}
              </Typography>
            </Button>
          </Typography>
        </Tooltip>
      ),
    [dynamicPrimaryColor, handleStar, starSubmitting, starred, stars, tooltip, verified],
  );

  const shareDialogParams = useMemo(
    () => ({
      header: t('thread:shareThread'),
      title,
      text: t('thread:shareThreadText', { creatorUsername, commentCount }),
    }),
    [commentCount, creatorUsername, t, title],
  );

  const renderShareButton = useMemo(
    () => (
      <ShareButton
        tooltip={t('thread-tooltips:shareThread')}
        shareDialogParams={shareDialogParams}
      />
    ),
    [shareDialogParams, t],
  );

  const infoDialogParams = useMemo(
    () => ({
      header: title,
      emoji,
      creator,
      created,
      infoItems,
    }),
    [created, creator, infoItems, title],
  );

  const renderInfoButton = useMemo(
    () => (
      <InfoButton tooltip={t('thread-tooltips:threadInfo')} infoDialogParams={infoDialogParams} />
    ),
    [infoDialogParams, t],
  );

  const actionsDialogParams = useMemo(
    () => ({
      shareDialogParams,
      deleteActionParams: {
        text: t('thread:deleteThread'),
        callback: handleDeleteThread,
        disabled: verified === false,
      },
      shareText: t('thread:shareThread'),
      hideDeleteAction: !isOwner,
    }),
    [handleDeleteThread, isOwner, shareDialogParams, t, verified],
  );

  const handleClickReplyButton = useMemo(
    () => (comment: CommentObjectType) => (): void => {
      setCreateCommentDialogOpen(true);
      setTargetComment(comment);
      setTargetThread(null);
    },
    [setCreateCommentDialogOpen],
  );

  const textFieldPlaceholder = useMemo(
    () =>
      (!!targetComment &&
        t('forms:replyTo', {
          username: targetComment.user?.username || t('common:communityUser'),
        })) ||
      t('forms:postTo', { title }),
    [targetComment, t, title],
  );

  const refreshThread = useCallback((): void => {
    threadQuery();
    commentsQuery();
  }, [commentsQuery, threadQuery]);

  const renderActionsButton = useMemo(
    () => (
      <ActionsButton
        tooltip={t('thread-tooltips:threadActions')}
        actionsDialogParams={actionsDialogParams}
      />
    ),
    [actionsDialogParams, t],
  );

  const renderScore = useMemo(
    () =>
      !!verified && (
        <Typography className={classes.score} variant="subtitle1" color="textSecondary">
          {score}
        </Typography>
      ),
    [classes.score, score, verified],
  );

  // Only render for non-verified users and owners to make the score more clear.
  const renderScoreIcon = useMemo(
    () => (!verified || isOwner) && <ThumbsUpDownOutlined color="disabled" />,
    [verified, isOwner],
  );

  const renderInputArea = useMemo(
    () => (
      <CreateCommentForm
        thread={targetThread}
        comment={targetComment}
        placeholder={textFieldPlaceholder}
        resetTargetComment={(): void => setTargetComment(null)}
        onCommentCreated={refreshThread}
      />
    ),
    [textFieldPlaceholder, targetComment, setTargetComment, refreshThread, targetThread],
  );

  const renderCommentsHeader = (
    <Grid className={classes.commentsHeader} container alignItems="center">
      <Typography variant="body2" color="textSecondary">
        {t('thread:comments', { commentCount })} {t('thread:sortedBy')} <OrderingButton />
      </Typography>
    </Grid>
  );

  const renderCreateCommentButton = useMemo(
    () =>
      smDown && (
        <Fab
          className={classes.createCommentButton}
          color="secondary"
          onClick={(): void => setCreateCommentDialogOpen(true)}
        >
          <AddOutlined />
        </Fab>
      ),
    [classes.createCommentButton, setCreateCommentDialogOpen, smDown],
  );

  const renderTopComment = useCallback(
    (comment: CommentObjectType, i: number): JSX.Element => (
      <CommentCard comment={comment} onCommentDeleted={refreshThread} topComment key={i} />
    ),
    [refreshThread],
  );

  const mapReplyComments = useCallback(
    (tc: CommentObjectType, i: number): JSX.Element[] =>
      tc.replyComments.map((rc) => (
        <CommentCard comment={rc} onCommentDeleted={refreshThread} key={i} />
      )),
    [refreshThread],
  );

  const renderReplyButton = useCallback(
    (comment: CommentObjectType): JSX.Element => (
      <Box className={classes.replyButtonContainer}>
        <Button onClick={handleClickReplyButton(comment)} variant="text" fullWidth>
          {t('forms:replyTo', {
            username: comment.user?.username?.toString() || t('common:communityUser'),
          })}
        </Button>
      </Box>
    ),
    [classes.replyButtonContainer, t, handleClickReplyButton],
  );

  const mapComments = useMemo(
    () =>
      comments.map((tc, i) => (
        <>
          {renderTopComment(tc, i)}
          {mapReplyComments(tc, i)}
          {renderReplyButton(tc)}
        </>
      )),
    [comments, mapReplyComments, renderReplyButton, renderTopComment],
  );

  const renderLoading = useMemo(() => commentsLoading && <LoadingBox />, [commentsLoading]);
  const renderCommentsNotFound = useMemo(() => <NotFoundBox text={t('thread:noComments')} />, [t]);
  const renderCommentTableBody = useMemo(() => <TableBody>{mapComments}</TableBody>, [mapComments]);

  const renderCommentTable = useMemo(
    () =>
      !!comments.length && (
        <PaginatedTable
          renderTableBody={renderCommentTableBody}
          count={commentCount}
          extraFilters={commentQueryVariables}
        />
      ),
    [commentCount, renderCommentTableBody, commentQueryVariables, comments.length],
  );

  const renderComments = useMemo(
    () => renderLoading || renderCommentTable || renderCommentsNotFound,
    [renderCommentTable, renderCommentsNotFound, renderLoading],
  );

  const renderCustomBottomNavbarContent = useMemo(
    () => (
      <Grid container>
        <Grid item xs={4} container justify="flex-start" alignItems="center">
          {renderStarButton}
        </Grid>
        <Grid item xs={8} container justify="flex-end" alignItems="center">
          {renderUpvoteButton}
          {renderScoreIcon}
          {renderScore}
          {renderDownvoteButton}
        </Grid>
      </Grid>
    ),
    [renderDownvoteButton, renderScore, renderScoreIcon, renderStarButton, renderUpvoteButton],
  );

  // Only render the custom bottom navbar if the user is verified since all of the actions are only available for verified users.
  // The default bottom navbar will be automatically shown for non-verified users.
  const renderCustomBottomNavbar = useMemo(
    () => !!verified && <BottomNavigation>{renderCustomBottomNavbarContent}</BottomNavigation>,
    [renderCustomBottomNavbarContent, verified],
  );

  const renderEmoji = useMemo(() => <Emoji emoji={emoji} />, []);

  const renderHeaderTitle = useMemo(
    () => (
      <Typography
        className={clsx('MuiCardHeader-title', classes.headerTitle, 'truncate-text')}
        variant="h5"
        align="left"
      >
        {title}
        {renderEmoji}
      </Typography>
    ),
    [classes.headerTitle, renderEmoji, title],
  );

  const renderThreadImageThumbnail = useMemo(
    () =>
      !!imageThumbnail && (
        <Tooltip title={t('thread-tooltips:threadImage')}>
          <Box className={classes.imageThumbnailContainer}>
            <Image
              className={classes.imageThumbnail}
              onClick={(): void => setThreadImageViewerValue(image)}
              loader={mediaLoader}
              src={imageThumbnail}
              layout="fixed"
              width={60}
              height={60}
              alt={t('alt-texts:threadImage')}
            />
          </Box>
        </Tooltip>
      ),
    [
      classes.imageThumbnail,
      classes.imageThumbnailContainer,
      imageThumbnail,
      t,
      image,
      setThreadImageViewerValue,
    ],
  );

  const renderThreadText = useMemo(() => <Typography variant="body2">{text}</Typography>, [text]);

  const renderThreadInfo = useMemo(
    () => (
      <CardContent>
        <Grid container>
          {renderThreadImageThumbnail}
          {renderThreadText}
        </Grid>
      </CardContent>
    ),
    [renderThreadImageThumbnail, renderThreadText],
  );

  const renderHeaderAction = useMemo(
    () => (
      <Grid className="MuiCardHeader-action" container alignItems="center">
        {renderStarButton}
        {renderUpvoteButton}
        {renderScore}
        {renderDownvoteButton}
        {renderShareButton}
        {renderInfoButton}
        {renderActionsButton}
      </Grid>
    ),
    [
      renderActionsButton,
      renderDownvoteButton,
      renderInfoButton,
      renderScore,
      renderShareButton,
      renderStarButton,
      renderUpvoteButton,
    ],
  );

  const renderHeader = useMemo(
    () => mdUp && <CardHeader title={renderHeaderTitle} action={renderHeaderAction} />,
    [mdUp, renderHeaderAction, renderHeaderTitle],
  );

  const layoutProps = {
    seoProps: {
      title,
    },
    topNavbarProps: {
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
    },
    customBottomNavbar: renderCustomBottomNavbar,
  };

  // Render full screen loading screen only for the thread query during the initial load.
  if (threadLoading && !previousThreadQueryData) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (!userMe) {
    return (
      <LoginRequiredTemplate {...layoutProps}>
        <Paper className={classes.container}>
          {renderHeader}
          {renderThreadInfo}
        </Paper>
      </LoginRequiredTemplate>
    );
  }

  if (!verified) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} />;
  }

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={clsx(classes.container, classes.containerPadding)}>
        {renderHeader}
        {renderThreadInfo}
        {renderInputArea}
        {renderCommentsHeader}
        {renderComments}
        {renderCreateCommentButton}
      </Paper>
    </MainTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

const namespaces = ['thread', 'thread-tooltips'];

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(namespaces, locale),
  },
  revalidate: MAX_REVALIDATION_INTERVAL,
});

const withWrappers = R.compose(withUserMe, withActions, withInfo, withThread);

export default withWrappers(ThreadPage);
