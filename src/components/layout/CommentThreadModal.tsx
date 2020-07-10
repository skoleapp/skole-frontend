import { Fade, Paper } from '@material-ui/core';
import { useDiscussionContext } from 'context';
import React from 'react';

import { ModalHeader } from '..';
import { ReplyCommentThread, StyledModal } from '..';

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
