import { StyledModal } from '../shared/StyledModal';
import { Fade, Paper, Box, Typography, Divider } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { ModalCloseIcon } from '..';
import { AnyAction } from 'redux';
import { DiscussionBox, CommentCard } from '../shared';
import * as R from 'ramda';
import { CommentObjectType } from '../../../generated/graphql';
import styled from 'styled-components';

export const CommentThread: React.FC = () => {
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);
    const comments = R.propOr([], 'replyComments', commentThread) as CommentObjectType[];

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
                    <DiscussionBox comments={comments} thread />
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
