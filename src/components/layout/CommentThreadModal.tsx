import { Box, makeStyles } from '@material-ui/core';
import { useDiscussionContext } from 'context';
import React from 'react';

import { ReplyCommentThread } from '../discussion';
import { DialogHeader, SkoleDialog } from '../shared';

const useStyles = makeStyles({
  paper: {
    height: '100%',
  },
});

export const CommentThreadModal: React.FC = () => {
  const classes = useStyles();
  const { topComment, toggleTopComment } = useDiscussionContext();
  const handleClose = (): void => toggleTopComment(null);

  return (
    <SkoleDialog
      open={!!topComment}
      onClose={handleClose}
      classes={{ paper: classes.paper }}
    >
      <DialogHeader onCancel={handleClose} />
      <Box position="relative" flexGrow="1">
        <ReplyCommentThread />
      </Box>
    </SkoleDialog>
  );
};
