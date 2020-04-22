import { Fade, Paper } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';

import { ModalHeader } from '..';
import { CommentObjectType } from '../../../generated/graphql';
import { useCommentThreadContext } from '../../context';
import { useTranslation } from '../../i18n';
import { DiscussionBox } from '../shared';
import { StyledModal } from '../shared/StyledModal';

export const CommentThreadModal: React.FC = () => {
    const { t } = useTranslation();
    const { topComment, toggleCommentThread } = useCommentThreadContext();
    const handleClose = (): void => toggleCommentThread(null);
    const username = R.pathOr('', ['user', 'username'], topComment);

    const discussionBoxProps = {
        topComment,
        comments: R.propOr([], 'replyComments', topComment) as CommentObjectType[],
        target: { comment: Number(R.propOr(undefined, 'id', topComment)) },
        isThread: true,
        formKey: 'comment-thread',
        placeholderText: t('common:commentReplyPlaceholder', { username }),
    };

    return (
        <StyledModal open={!!topComment} onClose={handleClose}>
            <Fade in={!!topComment}>
                <Paper>
                    <ModalHeader onCancel={handleClose} />
                    <DiscussionBox {...discussionBoxProps} />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
