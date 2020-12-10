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
  useConfirmContext,
} from 'context';
import { CommentObjectType, DeleteCommentMutation, useDeleteCommentMutation } from 'generated';
import { useActionsDialog, useDayjs, useLanguageHeaderContext, useVotes } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { mediaUrl, truncate, urls } from 'utils';
import ReactMarkdown from 'react-markdown';
import { ResponsiveDialog, TextLink } from '../shared';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    borderRadius: 0,
    overflow: 'visible',
    boxShadow: 'none',
  },
  topComment: {
    borderBottom: `0.05rem solid ${palette.grey[300]}`,
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
    padding: `${spacing(3)} !important`,
  },
  messageContent: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
  },
  text: {
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  messageInfo: {
    minHeight: '1.85rem', // If the message info contains no buttons with relative position, make it have the same height as with the buttons though.
  },
  icon: {
    marginRight: spacing(1),
  },
  iconButton: {
    padding: spacing(2),
  },
  replyCount: {
    marginRight: spacing(1),
    padding: spacing(1),
  },
  actionsButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    margin: '0 auto',
    marginBottom: spacing(3),
    width: '2rem',
  },
}));

interface Props {
  comment: CommentObjectType;
  isThread?: boolean;
  isTopComment?: boolean;
  removeComment: (id: string) => void; // Callback function for removing the comment.
}

export const CommentCard: React.FC<Props> = ({
  comment,
  isThread,
  isTopComment,
  removeComment,
}) => {
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const { confirm } = useConfirmContext();
  const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user);
  const attachmentOnly = comment.text == '' && comment.attachment !== '';
  const initialVote = R.propOr(null, 'vote', comment);
  const initialScore = String(R.propOr(0, 'score', comment));
  const creatorId = R.propOr('', 'id', comment.user);
  const isOwner = !!userMe && userMe.id === creatorId;
  const commentId = R.propOr('', 'id', comment);
  const replyComments = R.propOr([], 'replyComments', comment);
  const replyCount = replyComments.length;
  const { setTopComment, setAttachmentViewerValue } = useDiscussionContext();
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], comment);
  const commentPreview = truncate(comment.text, 20);
  const created = useDayjs(comment.created).startOf('m').fromNow();

  const shareTitle = t('common:commentShareTitle', {
    creatorUsername,
  });

  const shareText = t('common:commentShareText', {
    creatorUsername,
    commentPreview,
  });

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderShareAction,
    renderReportAction,
    actionsButtonProps,
  } = useActionsDialog({ shareTitle, shareText });

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
      setTopComment(comment);
    }
  };

  const deleteCommentError = (): void => toggleNotification(t('notifications:deleteCommentError'));

  const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
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

    try {
      await confirm({
        title: t('common:deleteCommentTitle'),
        description: t('common:deleteCommentDescription'),
      });

      await deleteComment({ variables: { id: comment.id } });
    } catch {
      // User cancelled.
    }
  };

  const renderTitle = comment.user ? (
    <TextLink
      href={urls.user(comment.user.id)}
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
      avatar={<Avatar className="avatar-thumbnail" src={mediaUrl(avatarThumb)} />}
      title={renderTitle}
      subheader={created}
    />
  );

  const renderAttachment = (
    <Grid container>
      <CameraAltOutlined className={classes.icon} color="disabled" />
      <Typography className={classes.text} variant="body2">
        {t('common:clickToView')}
      </Typography>
    </Grid>
  );

  const renderText = (
    <Typography className={classes.text} variant="body2">
      <ReactMarkdown>{comment.text}</ReactMarkdown>
    </Typography>
  );

  const renderMessageContent = (
    <Box className={classes.messageContent}>{attachmentOnly ? renderAttachment : renderText}</Box>
  );

  const renderReplyCount = (!isThread || isTopComment) && (
    <Box display="flex" className={classes.replyCount}>
      <Tooltip title={t('tooltips:commentReplies', { replyCount })}>
        <CommentOutlined className={classes.icon} color="disabled" />
      </Tooltip>
      <Typography variant="body2" color="textSecondary">
        {replyCount}
      </Typography>
    </Box>
  );

  const renderAttachmentButton = !!comment.attachment && !attachmentOnly && (
    <Tooltip title={t('tooltips:attachment')}>
      <IconButton className={classes.iconButton} size="small" onClick={handleAttachmentClick}>
        <AttachFileOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderActionsButton = (
    <Tooltip title={t('common:actions')}>
      <IconButton
        {...actionsButtonProps}
        className={clsx(classes.iconButton, classes.actionsButton)}
        color="default"
      >
        <MoreHorizOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderMessageInfo = (
    <Grid className={classes.messageInfo} container alignItems="center">
      {renderReplyCount}
      {renderAttachmentButton}
      {renderActionsButton}
    </Grid>
  );

  const renderUpvoteButton = (
    <Tooltip title={upVoteButtonTooltip}>
      <Typography component="span">
        <IconButton className={classes.iconButton} {...upVoteButtonProps}>
          <KeyboardArrowUpOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderScore = <Typography variant="body2">{score}</Typography>;

  const renderDownvoteButton = (
    <Tooltip title={downVoteButtonTooltip}>
      <Typography component="span">
        <IconButton className={classes.iconButton} {...downVoteButtonProps}>
          <KeyboardArrowDownOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderVoteButtons = (
    <Grid item container xs={2} sm={1} direction="column" justify="center" alignItems="center">
      {renderUpvoteButton}
      {renderScore}
      {renderDownvoteButton}
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
        {renderActionsDrawer}
      </CardContent>
    </Grid>
  );

  return (
    <Card className={clsx(classes.root, isTopComment && classes.topComment)}>
      <CardActionArea onClick={handleClick}>
        <Grid container>
          {renderMessage}
          {renderVoteButtons}
        </Grid>
      </CardActionArea>
    </Card>
  );
};
