import { StyledModal } from '../shared/StyledModal';
import { Fade, Paper } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { ModalCloseIcon } from '..';
import { AnyAction } from 'redux';
import { DiscussionBox, CommentCard } from '../shared';
import * as R from 'ramda';
import { CommentObjectType } from '../../../generated/graphql';

export const CommentThread: React.FC = () => {
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);
    const comments = R.propOr([], 'replyComments', commentThread) as CommentObjectType[];

    return (
        <StyledModal open={!!commentThread} onClose={handleClose}>
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalCloseIcon onClick={handleClose} />
                    {!!commentThread && <CommentCard comment={commentThread} />}
                    <DiscussionBox comments={comments} thread />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
