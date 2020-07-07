import { Fade, Paper } from '@material-ui/core';
import React from 'react';
import { useDiscussionContext } from 'src/context';

import { ModalHeader } from '..';
import { ReplyCommentThread, StyledModal } from '../shared';

export const CommentThreadModal: React.FC = () => {
    const { topComment, toggleTopComment } = useDiscussionContext();
    const handleClose = (): void => toggleTopComment(null);

    return (
        <StyledModal open={!!topComment} onClose={handleClose}>
            <Fade in={!!topComment}>
                <Paper>
                    <ModalHeader onCancel={handleClose} />
                    <ReplyCommentThread />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
