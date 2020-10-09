import { Box, Button, Fab, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { useDiscussionContext } from 'context';
import { CommentObjectType } from 'generated';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { BOTTOM_NAVBAR_HEIGHT } from 'theme';
import { TopLevelCommentThreadProps } from 'types';

import { NotFoundBox } from '..';
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
        flexWrap: 'nowrap',
        height: '100%',
    },
    inputAreaContainer: {
        display: 'flex',
        minHeight: '9rem',
        [breakpoints.up('md')]: {
            padding: spacing(2),
        },
    },
    createCommentButton: {
        position: 'absolute',
        bottom: `calc(${BOTTOM_NAVBAR_HEIGHT} + ${spacing(5)})`,
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: 0.7,
    },
}));

export const TopLevelCommentThread: React.FC<TopLevelCommentThreadProps> = ({
    comments: initialComments,
    target,
    noComments,
}) => {
    const classes = useStyles();
    const { topLevelComments, setTopLevelComments, toggleCommentModal } = useDiscussionContext(initialComments);
    const { isMobileOrTablet } = useMediaQueries();
    const appendComments = (comment: CommentObjectType): void => setTopLevelComments([...topLevelComments, comment]);
    const openCommentModal = (): void => toggleCommentModal(true);
    const removeComment = (id: string): void => setTopLevelComments(topLevelComments.filter(c => c.id !== id));

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

    const renderCommentsNotFound = !topLevelComments.length && !!noComments && <NotFoundBox text={noComments} />;

    const renderMessageArea = (
        <Grid container direction="column" className={classes.messageArea}>
            {renderTopLevelComments}
            {renderCommentsNotFound}
        </Grid>
    );

    // For mobile devices, we only want to show a hidden element since the actual logic happens in the modal.
    const renderInputArea = isMobileOrTablet ? (
        <Box display="none">
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    ) : (
        <Box className={classes.inputAreaContainer}>
            <CreateCommentForm {...createCommentFormProps} />
        </Box>
    );

    const renderCreateCommentButton = isMobileOrTablet && (
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
    const { isMobileOrTablet } = useMediaQueries();
    const { topComment, toggleTopComment, toggleCommentModal } = useDiscussionContext();
    const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', topComment);
    const target = { comment: Number(R.propOr(undefined, 'id', topComment)) };
    const openCommentModal = (): void => toggleCommentModal(true);

    const appendComments = (comment: CommentObjectType): void => {
        if (!!topComment) {
            toggleTopComment({
                ...topComment,
                replyComments: [...topComment.replyComments, comment],
            });
        }
    };

    const removeComment = (id: string): void => {
        if (!!topComment) {
            if (id === topComment.id) {
                toggleTopComment(null); // Close modal if top comment gets deleted.
            } else {
                const filteredReplyComments: CommentObjectType[] = replyComments.filter(c => c.id !== id);
                toggleTopComment({ ...topComment, replyComments: filteredReplyComments });
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
        <>
            <CommentCard {...commentCardProps} comment={topComment} />
            <Box padding={spacing(2)} display="flex" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                    {replyComments.length} replies
                </Typography>
            </Box>
        </>
    );

    const renderReplyComments =
        !!replyComments.length &&
        replyComments.map((c, i) => <CommentCard {...commentCardProps} key={i} comment={c} />);

    const renderReplyButton = !!topComment && isMobileOrTablet && (
        <Box padding={spacing(2)} marginTop="auto">
            <Button onClick={openCommentModal} color="primary" variant="contained" fullWidth>
                {t('common:reply')}
            </Button>
        </Box>
    );

    const renderMessageArea = (
        <Grid container direction="column" className={classes.messageArea}>
            {renderTopComment}
            {renderReplyComments}
            {renderReplyButton}
        </Grid>
    );

    const renderCreateCommentForm = <CreateCommentForm {...createCommentFormProps} />;

    const renderInputArea = isMobileOrTablet ? (
        renderCreateCommentForm
    ) : (
        <Box padding={spacing(2)}>{renderCreateCommentForm}</Box>
    );

    return (
        <Grid container direction="column" className={classes.root}>
            {renderMessageArea}
            {renderInputArea}
        </Grid>
    );
};
