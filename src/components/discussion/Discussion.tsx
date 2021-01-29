import { useDiscussionLazyQuery } from '__generated__/src/graphql/common.graphql';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddOutlined from '@material-ui/icons/AddOutlined';
import clsx from 'clsx';
import { useDiscussionContext } from 'context';
import { CommentObjectType, DiscussionQuery } from 'generated';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { BORDER, BOTTOM_NAVBAR_HEIGHT } from 'theme';
import { CommentTarget } from 'types';

import { ErrorBox, LoadingBox, NotFoundBox } from '../shared';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flexWrap: 'nowrap',
    [breakpoints.up('md')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  },

  messageArea: {
    flexGrow: 1,
    overflowX: 'hidden',
    flexWrap: 'nowrap',
    [breakpoints.up('md')]: {
      overflowY: 'auto',
      height: '100%',
      borderTop: BORDER,
      borderBottom: BORDER,
    },
  },
  topLevelMessageArea: {
    [breakpoints.down('sm')]: {
      paddingBottom: spacing(22), // Make room for the create comment button on mobile.
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
  replyButtonContainer: {
    padding: spacing(2),
    borderBottom: BORDER,
  },
  loadingMoreItems: {
    padding: spacing(4),
  },
}));

interface Props {
  course?: string;
  resource?: string;
  initialCommentCount: string;
  noCommentsText?: string;
  courseName?: string;
  resourceTitle?: string;
}

const initialTarget = {
  course: null,
  resource: null,
  comment: null,
};

export const Discussion: React.FC<Props> = ({
  course = null,
  resource = null,
  initialCommentCount,
  noCommentsText,
  courseName,
  resourceTitle,
}) => {
  const classes = useStyles();
  const { query } = useRouter();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const context = useLanguageHeaderContext();
  const variables = { course, resource };
  const [target, setTarget] = useState<CommentTarget>(initialTarget);
  const [replyToUsername, setReplyToUsername] = useState('');
  const [prevCommentCount, setPrevCommentCount] = useState(0);
  const [visibleComments, setVisibleComments] = useState(10);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  const {
    comments,
    setComments,
    setCommentCount,
    setCreateCommentDialogOpen,
  } = useDiscussionContext();

  const onCompleted = ({ discussion }: DiscussionQuery) =>
    setComments(discussion as CommentObjectType[]);

  const [discussionQuery, { loading, error }] = useDiscussionLazyQuery({
    variables,
    context,
    onCompleted,
  });

  const loadMoreComments = () => {
    if (visibleComments < comments.length) {
      setLoadingMoreComments(true);

      setTimeout(() => {
        setLoadingMoreComments(false);
        setVisibleComments(visibleComments + 10);
      }, 400);
    }
  };

  const mobileScrollListener = () => {
    if (isMobile && window.scrollY + window.innerHeight >= document.body.scrollHeight - 20) {
      loadMoreComments();
    }
  };

  useEffect(() => {
    discussionQuery();
  }, []);

  // If a comment has been provided as a query parameter, load all comments.
  useEffect(() => {
    if (!prevCommentCount && query.comment && !!comments && !!comments.length) {
      setVisibleComments(comments.length);
    }
  }, [comments, query]);

  useEffect(() => {
    window.addEventListener('scroll', mobileScrollListener);

    return () => {
      window.removeEventListener('scroll', mobileScrollListener);
    };
  }, [visibleComments, isMobile, comments]);

  const scrollToBottom = () => {
    if (isMobile) {
      window.scrollTo(0, document.body.scrollHeight);
    } else if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (prevCommentCount) {
      comments.length > prevCommentCount && setVisibleComments(comments.length); // Automatically load all comments when a new comment is created.
    }

    setCommentCount(String(comments.length));
    setPrevCommentCount(comments.length);
  }, [comments, isMobile]);

  // Scroll to bottom when all comments are loaded.
  useEffect(() => {
    !query.comment && comments.length === visibleComments && scrollToBottom();
  }, [comments, visibleComments, query]);

  useEffect(() => {
    setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

  useEffect(() => {
    setTarget({
      ...target,
      course,
      resource,
    });
  }, [course, resource]);

  //   When loading more visibleComments, scroll to bottom.
  useEffect(() => {
    !!loadingMoreComments && scrollToBottom();
  }, [loadingMoreComments, isMobile]);

  const handleClickCreateComment = () => setCreateCommentDialogOpen(true);

  const handleResetCommentTarget = () =>
    setTarget({
      ...initialTarget,
      course,
      resource,
    });

  const handleClickReplyButton = (comment: CommentObjectType) => () => {
    setCreateCommentDialogOpen(true);
    setReplyToUsername(comment.user?.username || t('common:communityUser'));
    setTarget({ ...initialTarget, comment: comment.id });
  };

  const handleDesktopMessageAreaScroll = () => {
    if (
      isTabletOrDesktop &&
      messageAreaRef.current &&
      messageAreaRef.current.scrollTop + messageAreaRef.current.clientHeight >=
        messageAreaRef.current.scrollHeight - 20
    ) {
      loadMoreComments();
    }
  };

  const renderTopComment = (comment: CommentObjectType, i: number) => (
    <CommentCard comment={comment} onCommentDeleted={discussionQuery} key={i} topComment />
  );

  const getLastReply = (tc: CommentObjectType, rc: CommentObjectType) =>
    !!tc.replyComments.length && rc.id === tc.replyComments[tc.replyComments.length - 1].id;

  const mapReplyComments = (tc: CommentObjectType, i: number) =>
    tc.replyComments.map((rc) => (
      <CommentCard
        comment={rc}
        onCommentDeleted={discussionQuery}
        lastReply={getLastReply(tc, rc)}
        key={i}
      />
    ));

  const renderReplyButton = (comment: CommentObjectType) => (
    <Box className={classes.replyButtonContainer}>
      <Button onClick={handleClickReplyButton(comment)} color="primary" variant="text" fullWidth>
        {t('forms:replyTo', {
          username: comment.user?.username?.toString() || t('common:communityUser'),
        })}
      </Button>
    </Box>
  );

  const mapComments =
    !!comments &&
    !!comments.length &&
    comments.slice(0, visibleComments).map((tc, i) => (
      <>
        {renderTopComment(tc, i)}
        {mapReplyComments(tc, i)}
        {renderReplyButton(tc)}
      </>
    ));

  const renderLoading = ((!!loading && (!comments || !comments.length)) || !mapComments) && (
    <LoadingBox />
  );

  const renderError = !!error && <ErrorBox />;
  const renderCommentsNotFound = !!noCommentsText && <NotFoundBox text={noCommentsText} />;
  const renderComments = renderError || mapComments || renderLoading || renderCommentsNotFound;

  const renderLoadingMoreItems = !!loadingMoreComments && (
    <Grid className={classes.loadingMoreItems} container>
      <LoadingBox text={t('discussion:loadingMoreComments')} />
    </Grid>
  );

  const renderMessageArea = (
    <Grid
      ref={messageAreaRef}
      onScroll={handleDesktopMessageAreaScroll}
      container
      direction="column"
      className={clsx(classes.messageArea, classes.topLevelMessageArea)}
    >
      {renderComments}
      {renderLoadingMoreItems}
    </Grid>
  );

  const placeholder = courseName
    ? t('forms:postToCourse', { courseName })
    : resourceTitle
    ? t('forms:postToResource', { resourceTitle })
    : '';

  const dialogPlaceholder =
    (!!target.comment && !!replyToUsername && t('forms:replyTo', { username: replyToUsername })) ||
    placeholder;

  const renderInputArea = (
    <CreateCommentForm
      target={target}
      onCommentCreated={discussionQuery}
      placeholder={placeholder}
      dialogPlaceholder={dialogPlaceholder}
      resetCommentTarget={handleResetCommentTarget}
    />
  );

  const renderCreateCommentButton = isMobile && (
    <Fab
      className={classes.createCommentButton}
      color="secondary"
      onClick={handleClickCreateComment}
    >
      <AddOutlined />
    </Fab>
  );

  return (
    <Box flexGrow="1" position="relative" display="flex">
      <Grid container direction="column" className={classes.root}>
        {renderMessageArea}
        {renderInputArea}
        {renderCreateCommentButton}
      </Grid>
    </Box>
  );
};
