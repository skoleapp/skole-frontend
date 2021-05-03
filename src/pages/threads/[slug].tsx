import Avatar from '@material-ui/core/Avatar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MaterialLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddOutlined from '@material-ui/icons/AddOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import clsx from 'clsx';
import {
  ActionRequiredTemplate,
  ActionsButton,
  BadgeTierIcon,
  CommentCard,
  CreateCommentForm,
  CustomInviteDialog,
  Emoji,
  ErrorTemplate,
  FileDropDialog,
  LoadingTemplate,
  LoginRequiredTemplate,
  MainTemplate,
  MarkdownContent,
  NotFoundBox,
  OrderingButton,
  PaginatedTable,
  SkeletonCommentList,
  TextLink,
  VoteButton,
} from 'components';
import {
  useAuthContext,
  useConfirmContext,
  useDarkModeContext,
  useDragContext,
  useInviteContext,
  useMediaQueryContext,
  useNotificationsContext,
  useOrderingContext,
  useShareContext,
  useThreadContext,
} from 'context';
import {
  BadgeObjectType,
  BadgeTier,
  CommentObjectType,
  DeleteThreadMutation,
  StarMutation,
  ThreadCommentsQuery,
  ThreadCommentsQueryResult,
  ThreadObjectType,
  ThreadQuery,
  ThreadQueryResult,
  useDeleteThreadMutation,
  useStarMutation,
  useThreadCommentsLazyQuery,
  useThreadLazyQuery,
  VoteObjectType,
} from 'generated';
import { withActions, withThread, withUserMe } from 'hocs';
import { useDayjs, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { withDrag } from 'src/hocs/withDrag';
import { BORDER_RADIUS, BOTTOM_NAVBAR_HEIGHT } from 'styles';
import { MAX_REVALIDATION_INTERVAL, mediaLoader, mediaUrl, urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
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
    paddingBottom: spacing(2),
  },
  headerTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    marginLeft: spacing(2),
  },
  headerContent: {
    overflow: 'hidden',
  },
  score: {
    fontWeight: 'bold',
    margin: `0 ${spacing(1)}`,
  },
  headerActionItem: {
    [breakpoints.up('md')]: {
      marginLeft: spacing(1),
    },
  },
  threadInfo: {
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  threadInfoCardContent: {
    padding: `${spacing(2)} !important`,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    [breakpoints.up('md')]: {
      padding: `${spacing(4)} !important`,
    },
  },
  threadImageCardContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  threadText: {
    flexGrow: 1,
    fontSize: '0.95rem',
  },
  imageThumbnailContainer: {
    [breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
  avatar: {
    width: '2rem',
    height: '2rem',
    marginRight: spacing(4),
  },
  creatorInfoText: {
    fontSize: '0.75rem',
  },
  creatorScore: {
    marginRight: spacing(1),
    fontWeight: 'bold',
  },
  badgeTierIcon: {
    fontSize: '0.5rem',
    marginLeft: spacing(1),
    marginRight: spacing(0.5),
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
    marginLeft: 'env(safe-area-inset-left)',
    marginRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      padding: `${spacing(2)} ${spacing(3)}`,
    },
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
  const { mdUp, smDown } = useMediaQueryContext();
  const { query } = useRouter();
  const { userMe, verified } = useAuthContext();
  const context = useLanguageHeaderContext();
  const { ordering, setOrdering } = useOrderingContext();
  const [customInviteDialogOpenedCounter, setCustomInviteDialogOpenedCounter] = useState(0);
  const commentQueryVariables = R.pick(['slug', 'comment', 'page', 'pageSize'], query);
  const [threadData, setThreadData] = useState<ThreadQueryResult['data'] | null>(null);
  const [commentsData, setCommentsData] = useState<ThreadCommentsQueryResult['data'] | null>(null);

  const {
    customInviteDialogOpen,
    handleOpenCustomInviteDialog,
    handleCloseCustomInviteDialog,
  } = useInviteContext();

  const threadQueryParams = {
    variables: R.pick(['slug'], query),
    context,
    onCompleted: (thread: ThreadQuery): void => setThreadData(thread),
  };

  const [threadQuery, { loading: threadLoading, error: threadError }] = useThreadLazyQuery(
    threadQueryParams,
  );

  const [silentThreadQuery, { error: silentThreadError }] = useThreadLazyQuery(threadQueryParams);

  const commentsQueryParams = {
    variables: {
      ordering,
      ...commentQueryVariables,
    },
    context,
    onCompleted: (threadComments: ThreadCommentsQuery): void => setCommentsData(threadComments),
  };

  const [
    commentsQuery,
    { loading: commentsLoading, error: _commentsError },
  ] = useThreadCommentsLazyQuery(commentsQueryParams);

  const [silentCommentsQuery, { error: silentCommentsError }] = useThreadCommentsLazyQuery(
    commentsQueryParams,
  );

  const error = threadError || silentThreadError;
  const commentsError = _commentsError || silentCommentsError;
  const thread = R.prop('thread', threadData);
  const comments: CommentObjectType[] = R.pathOr([], ['comments', 'objects'], commentsData);
  const page = R.pathOr(1, ['comments', 'page'], commentsData);
  const paginationCount = R.pathOr(0, ['comments', 'count'], commentsData);
  const id = R.prop('id', thread);
  const slug = R.prop('slug', thread);
  const title = R.prop('title', thread);
  const text = R.prop('text', thread);
  const image = R.prop('image', thread);
  const imageThumbnail = R.prop('imageThumbnail', thread);
  const initialScore = R.propOr(0, 'score', thread);
  const initialStars = R.propOr(0, 'starCount', thread);
  const commentCount = R.propOr(0, 'commentCount', thread);
  const initialVote = R.prop('vote', thread);
  const initialStarred = R.prop('starred', thread);
  const views = R.propOr(0, 'views', thread);
  const creator = R.prop('user', thread);
  const creatorAvatarThumbnail = R.propOr('', 'avatarThumbnail', creator);
  const creatorScore = R.prop('score', creator);
  const isOwn = !!creator && userMe?.id === creator.id;
  const created = R.prop('created', thread);
  const creatorUsername = R.propOr(t('common:anonymousStudent'), 'username', creator);
  const [targetComment, setTargetComment] = useState<CommentObjectType | null>(null);
  const [targetThread, setTargetThread] = useState<ThreadObjectType | null>(null);
  const { dynamicPrimaryColor } = useDarkModeContext();
  const { handleOpenShareDialog } = useShareContext();
  const { setDragOver } = useDragContext();
  const [stars, setStars] = useState(0);
  const [starred, setStarred] = useState(false);
  const [currentVote, setCurrentVote] = useState<VoteObjectType | null>(null);
  const [score, setScore] = useState(0);
  const starButtonTooltip = starred ? t('thread-tooltips:unstar') : t('thread-tooltips:star');
  const creationTime = useDayjs(created).startOf('m').fromNow();
  const orderingPathname = urls.thread(slug);
  const badges: BadgeObjectType[] = R.propOr([], 'badges', creator);
  const diamondBadges = badges.filter((b) => b.tier === BadgeTier.Diamond);
  const goldBadges = badges.filter((b) => b.tier === BadgeTier.Gold);
  const silverBadges = badges.filter((b) => b.tier === BadgeTier.Silver);
  const bronzeBadges = badges.filter((b) => b.tier === BadgeTier.Bronze);

  const {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    setThreadImageViewerValue,
    formRef,
    setCommentImage,
    setCommentFileName,
  } = useThreadContext();

  const handleFileDrop = useCallback(
    (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];

      if (file) {
        setCreateCommentDialogOpen(true);

        if (file.type.includes('image')) {
          formRef.current?.setFieldValue('image', file);
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onloadend = (): void => {
            setCommentImage(reader.result);
          };
        } else {
          formRef.current?.setFieldValue('file', file);
          setCommentFileName(R.propOr('', 'name', file));
        }
      }

      setDragOver(false);
    },
    [setCreateCommentDialogOpen, formRef, setCommentFileName, setCommentImage, setDragOver],
  );

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  useEffect(() => {
    setStars(initialStars);
  }, [initialStars]);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote, setCurrentVote]);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore, setScore]);

  // Fetch initial data for thread and comments.
  useEffect(() => {
    threadQuery();

    if (verified) {
      commentsQuery();
    }
  }, [threadQuery, commentsQuery, verified]);

  // Re-fetch comments when the ordering is changed.
  useEffect(() => {
    commentsQuery();
  }, [ordering, commentsQuery]);

  // Set the target thread state whenever mounting or the create comment dialog is closed,
  useEffect(() => {
    if (!createCommentDialogOpen) {
      setTargetThread(thread);
    }
  }, [createCommentDialogOpen, thread]);

  // Open invite dialog if `invite` has been provided as a query parameter.
  useEffect(() => {
    if (typeof query.invite !== 'undefined' && customInviteDialogOpenedCounter < 1) {
      handleOpenCustomInviteDialog();
      setCustomInviteDialogOpenedCounter(customInviteDialogOpenedCounter + 1);
    }
  }, [
    query,
    handleOpenCustomInviteDialog,
    customInviteDialogOpenedCounter,
    setCustomInviteDialogOpenedCounter,
  ]);

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

  const renderStarButton = useMemo(
    () =>
      !!verified && (
        <Tooltip title={starButtonTooltip}>
          <Typography component="span">
            <IconButton
              onClick={handleStar}
              disabled={starSubmitting}
              color={starred ? dynamicPrimaryColor : 'default'}
              size="small"
            >
              <StarBorderOutlined color={starred ? dynamicPrimaryColor : 'disabled'} />
            </IconButton>
          </Typography>
        </Tooltip>
      ),
    [handleStar, starSubmitting, starred, dynamicPrimaryColor, verified, starButtonTooltip],
  );

  const shareDialogParams = useMemo(
    () => ({
      header: t('thread:shareHeader'),
      title: `${title} 💬`,
      text: t('thread:shareText', { title, creatorUsername, commentCount }),
    }),
    [t, title, creatorUsername, commentCount],
  );

  const handleClickShareButton = useCallback((): void => {
    handleCloseCustomInviteDialog();
    handleOpenShareDialog(shareDialogParams);
  }, [shareDialogParams, handleOpenShareDialog, handleCloseCustomInviteDialog]);

  const renderShareButton = useMemo(
    () => (
      <Tooltip title={t('thread-tooltips:share')}>
        <IconButton
          className={classes.headerActionItem}
          onClick={handleClickShareButton}
          size="small"
          color={smDown ? 'secondary' : 'default'}
        >
          <ShareOutlined />
        </IconButton>
      </Tooltip>
    ),
    [t, handleClickShareButton, classes.headerActionItem, smDown],
  );

  const actionsDialogParams = useMemo(
    () => ({
      shareDialogParams,
      deleteActionParams: {
        text: t('thread:deleteThread'),
        callback: handleDeleteThread,
        disabled: verified === false,
      },
      shareText: t('thread:shareHeader'),
      hideDeleteAction: !isOwn,
    }),
    [handleDeleteThread, isOwn, shareDialogParams, t, verified],
  );

  const handleClickReplyButton = useCallback(
    (comment: CommentObjectType): void => {
      setCreateCommentDialogOpen(true);
      setTargetThread(null);

      if (comment.comment) {
        setTargetComment(comment.comment);
      } else {
        setTargetComment(comment);
      }
    },
    [setCreateCommentDialogOpen],
  );

  const textFieldPlaceholder = useMemo(
    () =>
      (!!targetComment &&
        t('forms:replyTo', {
          username: targetComment.user?.username || t('common:anonymousStudent'),
        })) ||
      t('forms:postTo', { title }),
    [targetComment, t, title],
  );

  const silentlyRefreshThread = useCallback((): void => {
    silentThreadQuery();
    silentCommentsQuery();
  }, [silentCommentsQuery, silentThreadQuery]);

  const handleCommentCreated = useCallback(
    (topComment: boolean): void => {
      if (topComment && ordering !== 'newest') {
        setOrdering({ pathname: orderingPathname, ordering: 'newest' });
        silentThreadQuery();
        commentsQuery();
      } else {
        silentlyRefreshThread();
      }
    },
    [
      silentlyRefreshThread,
      setOrdering,
      ordering,
      commentsQuery,
      silentThreadQuery,
      orderingPathname,
    ],
  );

  const renderActionsButton = useMemo(
    () =>
      !!isOwn && (
        <ActionsButton
          tooltip={t('thread-tooltips:threadActions')}
          actionsDialogParams={actionsDialogParams}
          className={classes.headerActionItem}
        />
      ),
    [actionsDialogParams, t, classes.headerActionItem, isOwn],
  );

  const renderMobileShareButton = useMemo(
    () => (
      <IconButton color="secondary" size="small" onClick={handleClickShareButton}>
        <ShareOutlined />
      </IconButton>
    ),
    [handleClickShareButton],
  );

  const renderVoteButton = useCallback(
    (variant) => (
      <VoteButton
        currentVote={currentVote}
        setCurrentVote={setCurrentVote}
        setScore={setScore}
        variant={variant}
        isOwn={isOwn}
        variables={{ thread: id }}
      />
    ),
    [isOwn, id, currentVote],
  );

  const renderScore = useMemo(
    () => (
      <Typography className={classes.score} variant="subtitle1" color="textSecondary">
        {score}
      </Typography>
    ),
    [score, classes.score],
  );

  const renderInputArea = useMemo(
    () => (
      <CreateCommentForm
        thread={targetThread}
        comment={targetComment}
        placeholder={textFieldPlaceholder}
        resetTargetComment={(): void => setTargetComment(null)}
        onCommentCreated={handleCommentCreated}
      />
    ),
    [textFieldPlaceholder, targetComment, setTargetComment, targetThread, handleCommentCreated],
  );

  const renderCommentsHeader = useMemo(
    () => (
      <Grid className={classes.commentsHeader} container alignItems="center">
        <Typography variant="body2" color="textSecondary">
          {t('thread:sortedBy')} <OrderingButton pathname={orderingPathname} />
        </Typography>
      </Grid>
    ),
    [classes.commentsHeader, t, orderingPathname],
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
    (comment: CommentObjectType): JSX.Element => (
      <CommentCard
        comment={comment}
        onCommentDeleted={silentlyRefreshThread}
        topComment
        handleClickReplyButton={handleClickReplyButton}
        key={comment.id}
      />
    ),
    [silentlyRefreshThread, handleClickReplyButton],
  );

  const mapReplyComments = useCallback(
    (tc: CommentObjectType): JSX.Element[] =>
      tc.replyComments.map((rc) => (
        <CommentCard
          comment={rc}
          onCommentDeleted={silentlyRefreshThread}
          handleClickReplyButton={handleClickReplyButton}
          key={rc.id}
        />
      )),
    [silentlyRefreshThread, handleClickReplyButton],
  );

  const mapComments = useMemo(
    () =>
      comments.map((tc) => (
        <>
          {renderTopComment(tc)}
          {mapReplyComments(tc)}
        </>
      )),
    [comments, mapReplyComments, renderTopComment],
  );

  const renderLoading = useMemo(() => commentsLoading && <SkeletonCommentList />, [
    commentsLoading,
  ]);

  const renderCommentsError = useMemo(
    () => !!commentsError && <NotFoundBox text={t('thread:commentsError')} />,
    [t, commentsError],
  );

  const renderCommentsNotFound = useMemo(() => <NotFoundBox text={t('thread:noComments')} />, [t]);
  const renderCommentTableBody = useMemo(() => <TableBody>{mapComments}</TableBody>, [mapComments]);

  const renderCommentTable = useMemo(
    () =>
      !!comments.length && (
        <PaginatedTable
          renderTableBody={renderCommentTableBody}
          page={page}
          count={paginationCount}
          extraFilters={{ slug }}
        />
      ),
    [page, paginationCount, renderCommentTableBody, comments.length, slug],
  );

  const renderComments = useMemo(
    () => renderLoading || renderCommentTable || renderCommentsError || renderCommentsNotFound,
    [renderCommentTable, renderCommentsNotFound, renderCommentsError, renderLoading],
  );

  // Only render for verified users.
  const renderCustomBottomNavbar = useMemo(
    () =>
      !!verified && (
        <BottomNavigation className={classes.bottomNavigation}>
          <Grid container>
            <Grid item xs={4} container justify="flex-start" alignItems="center">
              {renderStarButton}
            </Grid>
            <Grid item xs={8} container justify="flex-end" alignItems="center">
              {renderVoteButton('upvote')}
              {renderScore}
              {renderVoteButton('downvote')}
            </Grid>
          </Grid>
        </BottomNavigation>
      ),
    [renderVoteButton, renderStarButton, verified, classes.bottomNavigation, renderScore],
  );

  const renderHeaderTitle = useMemo(
    () => (
      <Typography
        className={clsx('MuiCardHeader-title', classes.headerTitle, 'truncate-text')}
        variant="h5"
        align="left"
      >
        {title}
      </Typography>
    ),
    [classes.headerTitle, title],
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

  const renderDesktopVoteButtonsSection = useMemo(
    () =>
      mdUp && (
        <Grid item xs={1} container>
          <CardContent className={classes.threadInfoCardContent}>
            <Grid item container direction="column" justify="center" alignItems="center">
              {renderVoteButton('upvote')}
              {renderScore}
              {renderVoteButton('downvote')}
            </Grid>
          </CardContent>
        </Grid>
      ),
    [classes.threadInfoCardContent, mdUp, renderVoteButton, renderScore],
  );

  const renderText = useMemo(
    () => (
      <Typography className={classes.threadText} variant="body2">
        <MarkdownContent>{text}</MarkdownContent>
      </Typography>
    ),
    [classes.threadText, text],
  );

  const renderTitleAndTextSection = useMemo(
    () => (
      <Grid item xs={9} md={8} container direction="column" wrap="nowrap">
        <CardContent className={classes.threadInfoCardContent}>
          {renderMobileTitle}
          {renderText}
        </CardContent>
      </Grid>
    ),
    [classes.threadInfoCardContent, renderMobileTitle, renderText],
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

  const renderImageSection = useMemo(
    () => (
      <Grid className={classes.imageThumbnailContainer} item xs={3} container justify="flex-end">
        <CardContent
          className={clsx(classes.threadInfoCardContent, classes.threadImageCardContent)}
        >
          {renderImageThumbnail}
        </CardContent>
      </Grid>
    ),
    [
      classes.imageThumbnailContainer,
      classes.threadImageCardContent,
      classes.threadInfoCardContent,
      renderImageThumbnail,
    ],
  );

  const renderCreatorLink = useMemo(
    () => !!creator && <TextLink href={urls.user(creator.slug)}>{creator.username}</TextLink>,
    [creator],
  );

  const renderCreator = useMemo(
    () => (creator ? renderCreatorLink : t('common:anonymousStudent')),
    [creator, renderCreatorLink, t],
  );

  const renderBadgeTierIcon = useCallback(
    (tier: BadgeTier) => <BadgeTierIcon tier={tier} className={classes.badgeTierIcon} />,
    [classes.badgeTierIcon],
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

  const renderCreatorInfoAndStatsSection = useMemo(
    () => (
      <Grid item xs={12} container>
        <Grid item xs={12} md={6}>
          <CardContent className={classes.threadInfoCardContent}>
            <Box display="flex" alignItems="center">
              <Avatar className={classes.avatar} src={mediaUrl(creatorAvatarThumbnail)} />
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" color="textSecondary">
                  {renderCreator} {t('common:created')} {creationTime}
                </Typography>
                <Grid container alignItems="center">
                  <Typography
                    className={clsx(classes.creatorInfoText, classes.creatorScore)}
                    variant="body2"
                    color="textSecondary"
                  >
                    {creatorScore}
                  </Typography>
                  <Typography
                    className={classes.creatorInfoText}
                    variant="body2"
                    color="textSecondary"
                  >
                    {renderDiamondBadgeCount} {renderGoldBadgeCount} {renderSilverBadgeCount}{' '}
                    {renderBronzeBadgeCount}
                  </Typography>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={6} container alignItems="flex-end">
          <CardContent className={classes.threadInfoCardContent}>
            <Typography variant="body2" color="textSecondary" align={smDown ? 'left' : 'right'}>
              {t('thread:views', { views })} |{t('thread:comments', { commentCount })} |{' '}
              {t('thread:stars', { stars })}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    ),
    [
      classes.creatorInfoText,
      classes.creatorScore,
      classes.threadInfoCardContent,
      classes.avatar,
      creationTime,
      creatorScore,
      renderBronzeBadgeCount,
      renderCreator,
      renderDiamondBadgeCount,
      renderGoldBadgeCount,
      renderSilverBadgeCount,
      t,
      stars,
      smDown,
      commentCount,
      views,
      creatorAvatarThumbnail,
    ],
  );

  const renderThreadInfo = useMemo(
    () => (
      <Grid className={classes.threadInfo} container>
        {renderDesktopVoteButtonsSection}
        {renderTitleAndTextSection}
        {renderImageSection}
        {renderCreatorInfoAndStatsSection}
      </Grid>
    ),
    [
      renderCreatorInfoAndStatsSection,
      renderDesktopVoteButtonsSection,
      renderImageSection,
      renderTitleAndTextSection,
      classes.threadInfo,
    ],
  );

  const renderHeaderAction = useMemo(
    () => (
      <Grid className="MuiCardHeader-action" container alignItems="center">
        {renderStarButton}
        {renderShareButton}
        {renderActionsButton}
      </Grid>
    ),
    [renderActionsButton, renderShareButton, renderStarButton],
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

  const renderInviteDialogHeader = useMemo(
    () => (
      <>
        Wohoo!
        <Emoji emoji="🥳" />
      </>
    ),
    [],
  );

  const renderInviteDialogText = useMemo(
    () => (
      <DialogContentText>
        <Typography variant="body2">
          <MaterialLink>@{title}</MaterialLink> {t('thread:inviteDialogText')}
        </Typography>
      </DialogContentText>
    ),
    [t, title],
  );

  const renderInviteDialog = useMemo(
    () => (
      <CustomInviteDialog
        open={customInviteDialogOpen}
        handleClose={handleCloseCustomInviteDialog}
        header={renderInviteDialogHeader}
        dynamicContent={[renderInviteDialogText]}
        handleClickInviteButton={handleClickShareButton}
        hideInviteCode
      />
    ),
    [
      renderInviteDialogHeader,
      renderInviteDialogText,
      customInviteDialogOpen,
      handleCloseCustomInviteDialog,
      handleClickShareButton,
    ],
  );

  const renderFileDropDialog = (
    <FileDropDialog title={t('thread:uploadToThread', { title })} handleFileDrop={handleFileDrop} />
  );

  const layoutProps = {
    seoProps: {
      title,
    },
    topNavbarProps: {
      renderHeaderRight: renderActionsButton || renderMobileShareButton,
    },
    customBottomNavbar: renderCustomBottomNavbar,
    hideBottomNavbar: !userMe,
  };

  if (threadLoading) {
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

  if (!thread && !threadLoading && !commentsLoading) {
    return <ErrorTemplate variant="not-found" />;
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
        {renderInviteDialog}
        {renderFileDropDialog}
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

const withWrappers = R.compose(withUserMe, withActions, withThread, withDrag);

export default withWrappers(ThreadPage);
