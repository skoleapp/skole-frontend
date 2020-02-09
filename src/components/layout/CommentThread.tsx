import { Box, Divider, Fade, Paper, Typography } from '@material-ui/core';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import styled from 'styled-components';

import { ModalCloseIcon } from '..';
import { CommentObjectType } from '../../../generated/graphql';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { CommentCard, DiscussionBox } from '../shared';
import { StyledModal } from '../shared/StyledModal';

export const CommentThread: React.FC = () => {
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);
    const [comments, setComments] = useState();
    const appendComments = (comments: CommentObjectType[]): void => setComments(comments);

    useEffect(() => {
        const initialComments = R.propOr([], 'replyComments', commentThread) as CommentObjectType[];
        setComments(initialComments);

        return (): void => {
            setComments([]);
        };
    }, [commentThread]);

    const discussionBoxProps = {
        comments,
        target: { commentId: Number(R.propOr(undefined, 'id', commentThread)) },
        isThread: true,
        appendComments,
    };

    return (
        <StyledCommentThread open={!!commentThread} onClose={handleClose}>
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalCloseIcon onClick={handleClose} />
                    {!!commentThread && <CommentCard comment={commentThread} />}
                    <Box padding="0.25rem" display="flex" alignItems="center">
                        <Typography variant="subtitle2" color="textSecondary">
                            {R.propOr('-', 'replyCount', commentThread)} replies
                        </Typography>
                        <Divider />
                    </Box>
                    <DiscussionBox {...discussionBoxProps} />
                </Paper>
            </Fade>
        </StyledCommentThread>
    );
};

const StyledCommentThread = styled(StyledModal)`
    .MuiDivider-root {
        flex-grow: 1;
        margin-left: 0.5rem;
    }
`;
