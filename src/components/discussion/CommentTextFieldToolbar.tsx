import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import { ClearCommentAttachmentButton } from './ClearCommentAttachmentButton';
import { CommentAttachmentButton } from './CommentAttachmentButton';
import { CommentTextFieldHelperText } from './CommentTextFieldHelperText';

export const CommentTextFieldToolbar: React.FC = () => (
  <FormControl>
    <Grid container alignItems="center">
      <Grid item xs={8} container>
        <CommentTextFieldHelperText />
      </Grid>
      <Grid item xs={4} container justify="flex-end">
        <CommentAttachmentButton />
        <ClearCommentAttachmentButton />
      </Grid>
    </Grid>
  </FormControl>
);
