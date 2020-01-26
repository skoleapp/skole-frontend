import { StyledModal } from './StyledModal';
import { Backdrop, Fade, Paper } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCommentThread } from '../../actions';
import { State } from '../../types';
import { ModalCloseIcon } from '..';
import { AnyAction } from 'redux';

export const CommentThread: React.FC = () => {
    const { commentThread } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleCommentThread(null) as unknown) as AnyAction);

    return (
        <StyledModal
            open={!!commentThread}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={!!commentThread}>
                <Paper>
                    <ModalCloseIcon onClick={handleClose} />
                </Paper>
            </Fade>
        </StyledModal>
    );
};
