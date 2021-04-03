import BottomNavigation from '@material-ui/core/BottomNavigation';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import AddOutlined from '@material-ui/icons/AddOutlined';
import KeyboardArrowDownOutlined from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@material-ui/icons/KeyboardArrowUpOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import clsx from 'clsx';
import {
  ActionRequiredTemplate,
  ActionsButton,
  CommentCard,
  CreateCommentForm,
  ErrorTemplate,
  LoadingBox,
  LoadingTemplate,
  LoginRequiredTemplate,
  MainTemplate,
  MarkdownContent,
  NotFoundBox,
  OrderingButton,
  PaginatedTable,
  TextLink,
} from 'components';
import {
  useAuthContext,
  useConfirmContext,
  useDarkModeContext,
  useNotificationsContext,
  useOrderingContext,
  useShareContext,
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
import { withActions, withThread, withUserMe } from 'hocs';
import { useDayjs, useLanguageHeaderContext, useMediaQueries, useVotes } from 'hooks';
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
  header: {
    paddingBottom: 0,
  },
  headerTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    marginLeft: spacing(2),
  },
  headerContent: {
    overflow: 'hidden',
  },
  desktopActionButtonWithText: {
    textTransform: 'none',
    padding: `${spacing(1.5)} ${spacing(3)}`,
  },
  headerActionItem: {
    [breakpoints.up('md')]: {
      marginLeft: spacing(2),
    },
  },
  starButtonLabel: {
    marginRight: spacing(2),
  },
  threadInfoCardContent: {
    padding: spacing(2),
    paddingBottom: '0 !important',
    [breakpoints.up('md')]: {
      padding: `${spacing(2)} ${spacing(4)}`,
      paddingBottom: `${spacing(2)} !important`,
    },
  },
  imageThumbnailContainer: {
    [breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
  creatorInfo: {
    marginTop: spacing(4),
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
    paddingTop: 0,
    [breakpoints.up('md')]: {
      padding: `${spacing(2)} ${spacing(4)}`,
      paddingTop: spacing(2),
    },
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
  bottomNavigation: {
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(1)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(1)})`,
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
  const [threadQueryCount, setThreadQueryCount] = useState(0);

  const commentVariables = {
    ordering,
    ...commentQueryVariables,
  };

  const [
    threadQuery,
    { data: threadData, loading: threadLoading, error: threadError },
  ] = useThreadLazyQuery({
    variables: threadVariables,
    context,
    onCompleted: () => setThreadQueryCount(threadQueryCount + 1),
  });

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
  const initialScore = R.propOr(0, 'score', thread);
  const initialStars = R.propOr(0, 'starCount', thread);
  const commentCount = R.propOr(0, 'commentCount', thread);
  const initialVote = R.prop('vote', thread);
  const initialStarred = R.prop('starred', thread);
  const creator = R.prop('user', thread);
  const isOwn = !!creator && userMe?.id === creator.id;
  const created = R.prop('created', thread);
  const creatorUsername = R.propOr(t('common:communityUser'), 'username', thread);
  const [targetComment, setTargetComment] = useState<CommentObjectType | null>(null);
  const [targetThread, setTargetThread] = useState<ThreadObjectType | null>(null);
  const { dynamicPrimaryColor } = useDarkModeContext();
  const { handleOpenShareDialog } = useShareContext();
  const [stars, setStars] = useState(0);
  const [starred, setStarred] = useState(false);
  const starButtonText = starred ? t('thread:unstar') : t('thread:star');
  const creationTime = useDayjs(created).startOf('day').fromNow();

  const {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    setThreadImageViewerValue,
  } = useThreadContext();

  const { score, upvoteButtonProps, downvoteButtonProps, currentVote } = useVotes({
    initialVote,
    initialScore,
    variables: { thread: id },
  });

  // Show a dynamic labels based on the vote status.
  const upvoteLabel = currentVote?.status === 1 ? t('thread:upvoted') : t('thread:upvote');
  const downvoteLabel = currentVote?.status === -1 ? t('thread:downvoted') : t('thread:downvote');

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
      setStars(stars + (star.starred ? 1 : -1));
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

  const starButtonTextProps: TypographyProps = useMemo(
    () => ({
      variant: 'body2',
      color: starred ? 'inherit' : 'textSecondary',
    }),
    [starred],
  );

  // Only render for verified users.
  const renderDesktopStarButton = useMemo(
    () =>
      !!verified && (
        <Button
          className={clsx(classes.desktopActionButtonWithText, classes.headerActionItem)}
          onClick={handleStar}
          disabled={starSubmitting}
          startIcon={<StarBorderOutlined color={starred ? dynamicPrimaryColor : 'disabled'} />}
          color={starred ? dynamicPrimaryColor : 'default'}
        >
          <Typography className={classes.starButtonLabel} {...starButtonTextProps}>
            {starButtonText}
          </Typography>
          <Typography {...starButtonTextProps}>{stars}</Typography>
        </Button>
      ),
    [
      handleStar,
      starSubmitting,
      verified,
      starButtonText,
      classes.desktopActionButtonWithText,
      classes.starButtonLabel,
      classes.headerActionItem,
      starButtonTextProps,
      stars,
      starred,
      dynamicPrimaryColor,
    ],
  );

  // Only render for verified users.
  const renderMobileStarButton = useMemo(
    () => (
      <IconButton
        onClick={handleStar}
        disabled={starSubmitting}
        color={starred ? dynamicPrimaryColor : 'default'}
        size="small"
      >
        <StarBorderOutlined color={starred ? dynamicPrimaryColor : 'disabled'} />
      </IconButton>
    ),
    [handleStar, starSubmitting, starred, dynamicPrimaryColor],
  );

  const shareDialogParams = useMemo(
    () => ({
      header: t('thread:shareThread'),
      title,
      text: t('thread:shareThreadText', { creatorUsername, commentCount }),
    }),
    [commentCount, creatorUsername, t, title],
  );

  const handleShareButtonClick = useCallback((): void => handleOpenShareDialog(shareDialogParams), [
    shareDialogParams,
    handleOpenShareDialog,
  ]);

  const renderShareButton = useMemo(
    () => (
      <Tooltip title={t('thread-tooltips:shareThread')}>
        <IconButton
          className={classes.headerActionItem}
          onClick={handleShareButtonClick}
          size="small"
          color={smDown ? 'secondary' : 'default'}
        >
          <ShareOutlined />
        </IconButton>
      </Tooltip>
    ),
    [t, handleShareButtonClick, classes.headerActionItem, smDown],
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
      hideDeleteAction: !isOwn,
    }),
    [handleDeleteThread, isOwn, shareDialogParams, t, verified],
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
        className={classes.headerActionItem}
      />
    ),
    [actionsDialogParams, t, classes.headerActionItem],
  );

  // Only render for verified user who are not owners.
  const renderDesktopUpvoteButton = useMemo(
    () =>
      !!verified &&
      !isOwn && (
        <Button
          className={classes.desktopActionButtonWithText}
          startIcon={
            <KeyboardArrowUpOutlined
              color={currentVote?.status === 1 ? dynamicPrimaryColor : 'disabled'}
            />
          }
          color={currentVote?.status === 1 ? dynamicPrimaryColor : 'default'}
          {...upvoteButtonProps}
        >
          <Typography
            variant="body2"
            color={currentVote?.status === 1 ? 'inherit' : 'textSecondary'}
          >
            {upvoteLabel}
          </Typography>
        </Button>
      ),
    [
      isOwn,
      upvoteButtonProps,
      verified,
      upvoteLabel,
      classes.desktopActionButtonWithText,
      currentVote,
      dynamicPrimaryColor,
    ],
  );

  // Only render for non-owners.
  const renderMobileUpvoteButton = useMemo(
    () =>
      !isOwn && (
        <IconButton {...upvoteButtonProps}>
          <KeyboardArrowUpOutlined />
        </IconButton>
      ),
    [isOwn, upvoteButtonProps],
  );

  // Only render for non-owners.
  const renderDesktopDownvoteButton = useMemo(
    () =>
      !!verified &&
      !isOwn && (
        <Button
          className={classes.desktopActionButtonWithText}
          startIcon={
            <KeyboardArrowDownOutlined
              color={currentVote?.status === -1 ? dynamicPrimaryColor : 'disabled'}
            />
          }
          color={currentVote?.status === -1 ? dynamicPrimaryColor : 'default'}
          {...downvoteButtonProps}
        >
          <Typography
            variant="body2"
            color={currentVote?.status === -1 ? 'inherit' : 'textSecondary'}
          >
            {downvoteLabel}
          </Typography>
        </Button>
      ),
    [
      downvoteButtonProps,
      isOwn,
      verified,
      downvoteLabel,
      classes.desktopActionButtonWithText,
      currentVote,
      dynamicPrimaryColor,
    ],
  );

  // Only render for non-owners.
  const renderMobileDownvoteButton = useMemo(
    () =>
      !isOwn && (
        <IconButton {...downvoteButtonProps}>
          <KeyboardArrowDownOutlined />
        </IconButton>
      ),
    [isOwn, downvoteButtonProps],
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

  // Only render for verified users.
  const renderCustomBottomNavbar = useMemo(
    () =>
      !!verified && (
        <BottomNavigation className={classes.bottomNavigation}>
          <Grid container>
            <Grid item xs={4} container justify="flex-start" alignItems="center">
              {renderMobileStarButton}
            </Grid>
            <Grid item xs={8} container justify="flex-end" alignItems="center">
              {renderMobileUpvoteButton}
              {renderMobileDownvoteButton}
            </Grid>
          </Grid>
        </BottomNavigation>
      ),
    [
      renderMobileDownvoteButton,
      renderMobileStarButton,
      renderMobileUpvoteButton,
      verified,
      classes.bottomNavigation,
    ],
  );

  const renderHeaderTitle = useMemo(
    () => (
      <Typography
        className={clsx('MuiCardHeader-title', classes.headerTitle, 'truncate-text')}
        variant="h5"
        align="left"
      >
        {title} ({score})
      </Typography>
    ),
    [classes.headerTitle, title, score],
  );

  const renderMobileTitle = useMemo(
    () =>
      smDown && (
        <Typography className="truncate-text" variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      ),
    [title, smDown],
  );

  const renderImageThumbnail = useMemo(
    () =>
      !!imageThumbnail && (
        <Tooltip title={t('thread-tooltips:threadImage')}>
          <Image
            className={classes.imageThumbnail}
            onClick={(): void => setThreadImageViewerValue(image)}
            loader={mediaLoader}
            src={imageThumbnail}
            layout="intrinsic"
            width={100}
            height={100}
            alt={t('alt-texts:threadImage')}
          />
        </Tooltip>
      ),
    [classes.imageThumbnail, imageThumbnail, t, image, setThreadImageViewerValue],
  );

  const renderText = useMemo(
    () => (
      <Typography className="truncate-text" variant="body2">
        <MarkdownContent>{text}</MarkdownContent>
      </Typography>
    ),
    [text],
  );

  const renderCreatorLink = useMemo(
    () => !!creator && <TextLink href={urls.user(creator.slu)}>{creator.username}</TextLink>,
    [creator],
  );

  const renderCreator = useMemo(() => (creator ? renderCreatorLink : t('common:communityUser')), [
    creator,
    renderCreatorLink,
    t,
  ]);

  const renderCreated = useMemo(
    () => (
      <Typography className={classes.creatorInfo} variant="body2" color="textSecondary">
        {t('common:createdBy')} {renderCreator} {creationTime}
      </Typography>
    ),
    [creationTime, renderCreator, t, classes.creatorInfo],
  );

  const renderThreadInfo = useMemo(
    () => (
      <Grid container wrap="nowrap">
        <Grid item xs={9} container direction="column" wrap="nowrap">
          <CardContent className={classes.threadInfoCardContent}>
            {renderMobileTitle}
            {renderText}
            {renderCreated}
          </CardContent>
        </Grid>
        <Grid className={classes.imageThumbnailContainer} item xs={3} container justify="flex-end">
          <CardContent className={classes.threadInfoCardContent}>
            {renderImageThumbnail}
          </CardContent>
        </Grid>
      </Grid>
    ),
    [
      classes.threadInfoCardContent,
      classes.imageThumbnailContainer,
      renderMobileTitle,
      renderText,
      renderCreated,
      renderImageThumbnail,
    ],
  );

  const renderHeaderAction = useMemo(
    () => (
      <Grid className="MuiCardHeader-action" container alignItems="center">
        {renderDesktopStarButton}
        {renderDesktopUpvoteButton}
        {renderDesktopDownvoteButton}
        {renderShareButton}
        {renderActionsButton}
      </Grid>
    ),
    [
      renderActionsButton,
      renderShareButton,
      renderDesktopDownvoteButton,
      renderDesktopStarButton,
      renderDesktopUpvoteButton,
    ],
  );

  const renderHeader = useMemo(
    () =>
      mdUp && (
        <CardHeader
          classes={{ root: classes.header, content: classes.headerContent }}
          title={renderHeaderTitle}
          action={renderHeaderAction}
        />
      ),
    [mdUp, renderHeaderAction, renderHeaderTitle, classes.header, classes.headerContent],
  );

  const layoutProps = {
    seoProps: {
      title,
    },
    topNavbarProps: {
      renderHeaderRight: renderActionsButton,
    },
    customBottomNavbar: renderCustomBottomNavbar,
  };

  // Render full screen loading screen only for the thread query during the initial load.
  if (threadLoading && threadQueryCount === 0) {
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

const withWrappers = R.compose(withUserMe, withActions, withThread);

export default withWrappers(ThreadPage);
