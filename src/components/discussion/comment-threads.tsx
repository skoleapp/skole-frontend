import { Box, Button, Fab, Grid, makeStyles, useTheme } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { useDiscussionContext } from 'context';
import { CommentObjectType } from 'generated';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { BORDER, BOTTOM_NAVBAR_HEIGHT } from 'theme';
import { TopLevelCommentThreadProps } from 'types';

import { NotFoundBox } from '../shared';
import { CommentCard } from './CommentCard';
import { CreateCommentForm } from './CreateCommentForm';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexWrap: 'nowrap',
  },
  messageArea: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    flexWrap: 'nowrap',
    height: '100%',
    [breakpoints.up('md')]: {
      borderTop: BORDER,
      borderBottom: BORDER,
    },
  },
  topLevelMessageArea: {
    [breakpoints.down('sm')]: {
      paddingBottom: spacing(22), // Make room for the create comment button on mobile.
    },
  },
  threadMessageArea: {
    marginTop: '0.05rem', // Prevent blocking the border.
    [breakpoints.down('sm')]: {
      paddingBottom: spacing(20), // Make room for the reply button on mobile.
      borderTop: BORDER,
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
  replyButton: {
    position: 'fixed',
    bottom: `calc(env(safe-area-inset-bottom) + ${spacing(2)})`,
    left: spacing(2),
    right: spacing(2),
  },
}));

export const TopLevelCommentThread: React.FC<TopLevelCommentThreadProps> = ({
  comments: initialTopLevelComments,
  target,
  noComments,
}) => {
  const classes = useStyles();
  const { isMobile } = useMediaQueries();
  const { topLevelComments, setTopLevelComments, toggleCommentModal } = useDiscussionContext();
  const openCommentModal = (): void => toggleCommentModal(true);

  useEffect(() => {
    setTopLevelComments(initialTopLevelComments);
  }, [initialTopLevelComments]);

  const appendComments = (comment: CommentObjectType): void =>
    setTopLevelComments([...topLevelComments, comment]);

  const removeComment = (id: string): void =>
    setTopLevelComments(topLevelComments.filter((c) => c.id !== id));

  const commentCardProps = {
    isThread: false,
    removeComment,
  };

  const createCommentFormProps = {
    target,
    appendComments,
  };

  const renderTopLevelComments =
    !!topLevelComments.length &&
    topLevelComments.map((c, i) => <CommentCard {...commentCardProps} key={i} comment={c} />);

  const renderCommentsNotFound = !topLevelComments.length && !!noComments && (
    <NotFoundBox text={noComments} />
  );

  const renderMessageArea = (
    <Grid
      container
      direction="column"
      className={clsx(classes.messageArea, classes.topLevelMessageArea)}
    >
      {renderTopLevelComments}
      {renderCommentsNotFound}
    </Grid>
  );

  const renderInputArea = <CreateCommentForm {...createCommentFormProps} />;

  const renderCreateCommentButton = isMobile && (
    <Fab className={classes.createCommentButton} color="secondary" onClick={openCommentModal}>
      <AddOutlined />
    </Fab>
  );

  return (
    <Box flexGrow="1" position="relative">
      <Grid container direction="column" className={classes.root}>
        {renderMessageArea}
        {renderInputArea}
        {renderCreateCommentButton}
      </Grid>
    </Box>
  );
};

export const ReplyCommentThread: React.FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();

  const {
    topComment,
    setTopComment,
    toggleCommentModal,
    topLevelComments,
    setTopLevelComments,
  } = useDiscussionContext();

  const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', topComment);
  const target = { comment: Number(R.prop('id', topComment)) };
  const openCommentModal = (): void => toggleCommentModal(true);

  const appendComments = (comment: CommentObjectType): void => {
    if (topComment) {
      setTopComment({
        ...topComment,
        replyComments: [...topComment.replyComments, comment],
      });

      // Update top-level comments.
      setTopLevelComments(
        topLevelComments.map((c) => {
          if (c.id === topComment.id) {
            return {
              ...topComment,
              replyComments: [...topComment.replyComments, comment],
            };
          }

          return c;
        }),
      );
    }
  };

  const removeComment = (id: string): void => {
    if (topComment) {
      if (id === topComment.id) {
        setTopComment(null); // Close modal if top comment gets deleted.
        setTopLevelComments(topLevelComments.filter((c) => c.id !== id)); // Filter deleted comment from top-level comments.
      } else {
        const filteredReplyComments = replyComments.filter((c) => c.id !== id);

        // Update reply comments for top comment.
        setTopComment({
          ...topComment,
          replyComments: filteredReplyComments,
        });

        // Update top-level comments.
        setTopLevelComments(
          topLevelComments.map((c) => {
            if (c.id === topComment.id) {
              return {
                ...c,
                replyComments: filteredReplyComments,
              };
            }

            return c;
          }),
        );
      }
    }
  };

  const commentCardProps = {
    isThread: true,
    removeComment,
  };

  const createCommentFormProps = {
    target,
    appendComments,
  };

  const renderTopComment = !!topComment && (
    <CommentCard {...commentCardProps} comment={topComment} isTopComment />
  );

  const renderReplyComments =
    !!replyComments.length &&
    replyComments.map((c, i) => <CommentCard {...commentCardProps} key={i} comment={c} />);

  const renderReplyButton = !!topComment && isMobile && (
    <Box className={classes.replyButton} padding={spacing(2)} marginTop="auto">
      <Button onClick={openCommentModal} color="primary" variant="contained" fullWidth>
        {t('common:reply')}
      </Button>
    </Box>
  );

  const renderMessageArea = (
    <Grid
      container
      direction="column"
      className={clsx(classes.messageArea, classes.threadMessageArea)}
    >
      {renderTopComment}
      {renderReplyComments}
      {renderReplyButton}
    </Grid>
  );

  const renderCreateCommentForm = <CreateCommentForm {...createCommentFormProps} />;

  return (
    <Grid container direction="column" className={classes.root}>
      {renderMessageArea}
      {renderCreateCommentForm}
    </Grid>
  );
};
