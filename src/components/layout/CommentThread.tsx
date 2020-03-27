import { Fade, Paper } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { ModalHeader } from '..';
import { CommentObjectType } from '../../../generated/graphql';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { DiscussionBox } from '../shared';
import { StyledModal } from '../shared/StyledModal';

export const CommentThread: React.FC = () => {
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);

    const discussionBoxProps = {
        commentThread,
        comments: R.propOr([], 'replyComments', commentThread) as CommentObjectType[],
        target: { comment: Number(R.propOr(undefined, 'id', commentThread)) },
        isThread: true,
        formKey: 'comment-thread',
    };

    return (
        <StyledModal open={!!commentThread} onClose={handleClose}>
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalHeader onCancel={handleClose} />
                    <DiscussionBox {...discussionBoxProps} />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
