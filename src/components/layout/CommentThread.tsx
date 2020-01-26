import { StyledModal } from '../shared/StyledModal';
import { Fade, Paper, CardContent, Typography, Box } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { ModalCloseIcon } from '..';
import { AnyAction } from 'redux';
import { CreateCommentForm, CommentCard } from '../shared';
import { CommentObjectType } from '../../../generated/graphql';
import { useTranslation } from '../../i18n';

export const CommentThread: React.FC = () => {
    const { t } = useTranslation();
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);

    const renderCommentThread = !!commentThread ? (
        <CardContent>
            <CommentCard comment={commentThread} disableClick />
            {commentThread.replyComments.length ? (
                commentThread.replyComments.map((c: CommentObjectType, i: number) => (
                    <Box key={i} marginTop="0.5rem">
                        <CommentCard comment={c} disableClick />
                    </Box>
                ))
            ) : (
                <Box textAlign="center" marginTop="0.5rem">
                    <Typography variant="subtitle1">{t('comments:noReplies')}</Typography>
                </Box>
            )}
            <CreateCommentForm label={t('forms:reply')} placeholder={t('forms:reply')} />
        </CardContent>
    ) : (
        <CardContent>
            <Box textAlign="center">
                <Typography variant="subtitle1">{t('comments:notFound')}</Typography>
            </Box>
        </CardContent>
    );

    return (
        <StyledModal open={!!commentThread} onClose={handleClose}>
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalCloseIcon onClick={handleClose} />
                    {renderCommentThread}
                </Paper>
            </Fade>
        </StyledModal>
    );
};
