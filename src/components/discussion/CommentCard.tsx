import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  AttachFileOutlined,
  CameraAltOutlined,
  CommentOutlined,
  DeleteOutline,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  MoreHorizOutlined,
} from '@material-ui/icons';
import clsx from 'clsx';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
} from 'context';
import {
  CommentObjectType,
  DeleteCommentMutation,
  useDeleteCommentMutation,
} from 'generated';
import {
  useActionsDialog,
  useDayjs,
  useLanguageHeaderContext,
  useVotes,
} from 'hooks';
import { useTranslation } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { mediaUrl, truncate, urls } from 'utils';
import { ResponsiveDialog, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    borderRadius: 0,
    overflow: 'visible',
    boxShadow: 'none',
  },
  cardHeader: {
    padding: 0,
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: '1rem',
  },
  cardSubHeader: {
    fontSize: '0.75rem',
  },
  cardContent: {
    padding: `${spacing(2)} !important`,
  },
  messageContent: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
  },
  text: {
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  toolbarButton: {
    marginLeft: spacing(2),
  },
  icon: {
    marginRight: spacing(1),
  },
  iconButton: {
    padding: spacing(1.5),
  },
  actionsButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing(1),
    margin: '0 auto',
    width: '2rem',
  },
}));

interface Props {
  comment: CommentObjectType;
  isThread?: boolean;
  removeComment: (id: string) => void; // Callback function for removing the comment.
}

export const CommentCard: React.FC<Props> = ({
  comment,
  isThread,
  removeComment,
}) => {
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const userId = R.propOr('', 'id', comment.user);
  const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user);
  const confirm = useConfirm();
  const attachmentOnly = comment.text == '' && comment.attachment !== '';
  const initialVote = R.propOr(null, 'vote', comment);
  const initialScore = String(R.propOr(0, 'score', comment));
  const creatorId = R.propOr('', 'id', comment.user);
  const isOwner = !!userMe && userMe.id === creatorId;
  const commentId = R.propOr('', 'id', comment);
  const shareQuery = `?comment=${commentId}`;
  const replyComments = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { toggleTopComment, setAttachmentViewerValue } = useDiscussionContext();

  const creatorUsername = R.propOr(
    t('common:communityUser'),
    'username',
    comment.user,
  );

  const shareText = t('common:commentShareText', {
    creatorUsername,
    commentPreview: truncate(comment.text, 20),
  });

  const created = useDayjs(comment.created).startOf('m').fromNow();

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderShareAction,
    renderReportAction,
    actionsButtonProps,
  } = useActionsDialog({ query: shareQuery, text: shareText });

  const {
    score,
    upVoteButtonProps,
    downVoteButtonProps,
    upVoteButtonTooltip,
    downVoteButtonTooltip,
  } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { comment: commentId },
  });

  const handleClick = (): void => {
    if (isThread) {
      attachmentOnly && setAttachmentViewerValue(comment.attachment);
    } else {
      toggleTopComment(comment);
    }
  };

  const deleteCommentError = (): void =>
    toggleNotification(t('notifications:deleteCommentError'));

  const deleteCommentCompleted = ({
    deleteComment,
  }: DeleteCommentMutation): void => {
    if (deleteComment) {
      if (!!deleteComment.errors && !!deleteComment.errors.length) {
        deleteCommentError();
      } else if (deleteComment.successMessage) {
        removeComment(comment.id);
        toggleNotification(deleteComment.successMessage);
      } else {
        deleteCommentError();
      }
    } else {
      deleteCommentError();
    }
  };

  const [deleteComment] = useDeleteCommentMutation({
    onCompleted: deleteCommentCompleted,
    onError: deleteCommentError,
    context,
  });

  const handleAttachmentClick = (e: SyntheticEvent): void => {
    e.stopPropagation();
    setAttachmentViewerValue(comment.attachment);
  };

  const handleDeleteComment = async (e: SyntheticEvent): Promise<void> => {
    e.stopPropagation();
    handleCloseActionsDialog(e);

    await confirm({
      title: t('common:deleteCommentTitle'),
      description: t('common:deleteCommentDescription'),
    });

    await deleteComment({ variables: { id: comment.id } });
  };

  const renderTitle = comment.user ? (
    <TextLink
      href={urls.user(userId)}
      onClick={(e: SyntheticEvent): void => e.stopPropagation()}
    >
      {comment.user.username}
    </TextLink>
  ) : (
    <Typography variant="body2" color="textSecondary">
      {t('common:communityUser')}
    </Typography>
  );

  const renderCardHeader = (
    <CardHeader
      classes={{
        root: classes.cardHeader,
        title: classes.cardTitle,
        subheader: classes.cardSubHeader,
      }}
      avatar={
        <Avatar className="avatar-thumbnail" src={mediaUrl(avatarThumb)} />
      }
      title={renderTitle}
      subheader={created}
    />
  );

  const renderCommentAttachment = (
    <Grid container>
      <CameraAltOutlined className={classes.icon} color="disabled" />
      <Typography className={classes.text} variant="body2">
        {t('common:clickToView')}
      </Typography>
    </Grid>
  );

  const renderCommentText = (
    <Typography variant="body2">{comment.text}</Typography>
  );

  const renderMessageContent = (
    <Box className={classes.messageContent}>
      {attachmentOnly ? renderCommentAttachment : renderCommentText}
    </Box>
  );

  const renderReplyCount = !isThread && (
    <>
      <Tooltip title={t('tooltips:commentReplies', { replyCount })}>
        <CommentOutlined className={classes.icon} color="disabled" />
      </Tooltip>
      <Typography variant="body2" color="textSecondary">
        {replyCount}
      </Typography>
    </>
  );

  const renderAttachmentButton = !!comment.attachment && !attachmentOnly && (
    <Tooltip title={t('tooltips:attachment')}>
      <IconButton
        className={classes.toolbarButton}
        size="small"
        onClick={handleAttachmentClick}
      >
        <AttachFileOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderActionsButton = (
    <Tooltip title={t('common:actions')}>
      <IconButton
        className={clsx(classes.iconButton, classes.actionsButton)}
        {...actionsButtonProps}
        color="default"
      >
        <MoreHorizOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderMessageInfo = (
    <Grid container alignItems="center">
      {renderReplyCount}
      {renderAttachmentButton}
    </Grid>
  );

  const renderVoteButtons = (
    <Grid
      item
      container
      xs={2}
      sm={1}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Tooltip title={upVoteButtonTooltip}>
        <Typography component="span">
          <IconButton className={classes.iconButton} {...upVoteButtonProps}>
            <KeyboardArrowUpOutlined className="vote-button" />
          </IconButton>
        </Typography>
      </Tooltip>
      <Typography variant="body2">{score}</Typography>
      <Tooltip title={downVoteButtonTooltip}>
        <Typography component="span">
          <IconButton className={classes.iconButton} {...downVoteButtonProps}>
            <KeyboardArrowDownOutlined className="vote-button" />
          </IconButton>
        </Typography>
      </Tooltip>
    </Grid>
  );

  const renderDeleteAction = isOwner && (
    <MenuItem onClick={handleDeleteComment}>
      <ListItemIcon>
        <DeleteOutline />
      </ListItemIcon>
      <ListItemText>{t('common:delete')}</ListItemText>
    </MenuItem>
  );

  const renderActionsDialogContent = (
    <List>
      {renderShareAction}
      {renderDeleteAction}
      {renderReportAction}
    </List>
  );

  const renderActionsDrawer = (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
    >
      {renderActionsDialogContent}
    </ResponsiveDialog>
  );

  const renderMessage = (
    <Grid item xs={10} sm={11}>
      <CardContent className={classes.cardContent}>
        {renderCardHeader}
        {renderMessageContent}
        {renderMessageInfo}
        {renderActionsButton}
        {renderActionsDrawer}
      </CardContent>
    </Grid>
  );

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={handleClick}>
        <Grid container>
          {renderMessage}
          {renderVoteButtons}
        </Grid>
      </CardActionArea>
    </Card>
  );
};
