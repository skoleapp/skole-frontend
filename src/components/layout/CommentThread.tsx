import { Fade, Paper } from '@material-ui/core';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { ModalCloseIcon } from '..';
import { CommentObjectType } from '../../../generated/graphql';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { DiscussionBox } from '../shared';
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
        commentThread,
        comments,
        target: { comment: Number(R.propOr(undefined, 'id', commentThread)) },
        isThread: true,
        appendComments,
    };

    return (
        <StyledModal open={!!commentThread} onClose={handleClose}>
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalCloseIcon onClick={handleClose} />
                    <DiscussionBox {...discussionBoxProps} />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
