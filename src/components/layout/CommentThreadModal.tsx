import { Box, Dialog, makeStyles } from '@material-ui/core';
import { useDiscussionContext } from 'context';
import { useMediaQueries } from 'hooks';
import React from 'react';

import { DialogHeader } from '..';
import { ReplyCommentThread } from '..';
import { Transition } from '../shared';

const useStyles = makeStyles({
    paper: {
        height: '100%',
    },
});

export const CommentThreadModal: React.FC = () => {
    const classes = useStyles();
    const { topComment, toggleTopComment } = useDiscussionContext();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();
    const handleClose = (): void => toggleTopComment(null);

    return (
        <Dialog
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            open={!!topComment}
            onClose={handleClose}
            classes={{ paper: classes.paper }}
            TransitionComponent={Transition}
        >
            <DialogHeader onCancel={handleClose} />
            <Box position="relative" flexGrow="1">
                <ReplyCommentThread />
            </Box>
        </Dialog>
    );
};
