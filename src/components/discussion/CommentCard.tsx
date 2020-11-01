import {
    Avatar,
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
} from '@material-ui/icons';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { CommentObjectType, DeleteCommentMutation, useDeleteCommentMutation, VoteObjectType } from 'generated';
import { useActionsDialog, useDayjs, useLanguageHeaderContext, useVotes } from 'hooks';
import { useTranslation } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { mediaURL, truncate, urls } from 'utils';

import { ResponsiveDialog, TextLink } from '..';

const useStyles = makeStyles(({ spacing }) => ({
    root: {
        borderRadius: 0,
        overflow: 'visible',
        boxShadow: 'none',
    },
    cardHeader: {
        padding: `${spacing(2)} ${spacing(3)}`,
        textAlign: 'left',
    },
    cardTitle: {
        fontSize: '1rem',
    },
    cardSubHeader: {
        fontSize: '0.75rem',
    },
    cardContent: {
        padding: spacing(3),
    },
    text: {
        overflow: 'hidden',
        wordBreak: 'break-word',
    },
    toolbarButton: {
        marginLeft: spacing(1),
    },
    icon: {
        marginRight: spacing(1),
    },
}));

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void; // Callback function for removing the comment.
}

export const CommentCard: React.FC<Props> = ({ comment, isThread, removeComment }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { userMe, verified } = useAuthContext();
    const userId: string = R.propOr('', 'id', comment.user);
    const avatarThumb: string = R.propOr('', 'avatarThumbnail', comment.user);
    const confirm = useConfirm();
    const attachmentOnly = comment.text == '' && comment.attachment !== '';
    const initialVote = R.propOr(null, 'vote', comment) as VoteObjectType | null;
    const initialScore = String(R.propOr(0, 'score', comment));
    const creatorId = R.propOr('', 'id', comment.user) as string;
    const isOwner = !!userMe && userMe.id === creatorId;
    const commentId = R.propOr('', 'id', comment) as string;
    const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', comment);
    const replyCount = replyComments.length;
    const { toggleNotification } = useNotificationsContext();
    const { toggleTopComment, setAttachmentViewerValue } = useDiscussionContext();
    const shareQuery = `?comment=${commentId}`;
    const creatorUsername: string = R.propOr(t('common:communityUser'), 'username', comment.user);
    const shareText = t('common:commentShareText', { creatorUsername, commentPreview: truncate(comment.text, 20) });
    const context = useLanguageHeaderContext();

    const created = useDayjs(comment.created)
        .startOf('m')
        .fromNow();

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderShareAction,
        renderReportAction,
        renderDefaultActionsButton,
    } = useActionsDialog({ query: shareQuery, text: shareText });

    const { score, upVoteButtonProps, downVoteButtonProps, upVoteButtonTooltip, downVoteButtonTooltip } = useVotes({
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

    const deleteCommentError = (): void => toggleNotification(t('notifications:deleteCommentError'));

    const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
        if (!!deleteComment) {
            if (!!deleteComment.errors && !!deleteComment.errors.length) {
                deleteCommentError();
            } else if (!!deleteComment.message) {
                removeComment(comment.id);
                toggleNotification(deleteComment.message);
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
            await confirm({ title: t('common:deleteCommentTitle'), description: t('common:deleteCommentDescription') });
            await deleteComment({ variables: { id: comment.id } });
        } catch {
            // User cancelled.
        }
    };

    const renderTitle = !!comment.user ? (
        <TextLink href={urls.user(userId)} onClick={(e: SyntheticEvent): void => e.stopPropagation()}>
            {comment.user.username}
        </TextLink>
    ) : (
        <Typography variant="body2" color="textSecondary">
            {t('common:communityUser')}
        </Typography>
    );

    const renderCardHeader = (
        <CardHeader
            classes={{ root: classes.cardHeader, title: classes.cardTitle, subheader: classes.cardSubHeader }}
            avatar={<Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />}
            title={renderTitle}
            subheader={created}
        />
    );

    const renderContentSection = (
        <Grid item container xs={11} justify="flex-start">
            {attachmentOnly ? (
                <Grid container>
                    <CameraAltOutlined className={classes.icon} color="disabled" />
                    <Typography className={classes.text} variant="body2">
                        {t('common:clickToView')}
                    </Typography>
                </Grid>
            ) : (
                <Typography variant="body2">{comment.text}</Typography>
            )}
        </Grid>
    );

    const renderVoteSection = (
        <Grid item container xs={1} direction="column" justify="center" alignItems="center">
            <Tooltip title={upVoteButtonTooltip}>
                <Typography component="span">
                    <IconButton {...upVoteButtonProps}>
                        <KeyboardArrowUpOutlined className="vote-button" />
                    </IconButton>
                </Typography>
            </Tooltip>
            <Typography variant="body2">{score}</Typography>
            <Tooltip title={downVoteButtonTooltip}>
                <Typography component="span">
                    <IconButton {...downVoteButtonProps}>
                        <KeyboardArrowDownOutlined className="vote-button" />
                    </IconButton>
                </Typography>
            </Tooltip>
        </Grid>
    );

    const renderReplyCount = !isThread && (
        <>
            <Tooltip title={t('tooltips:commentReplies', { replyCount })}>
                <CommentOutlined className={classes.icon} color="disabled" />
            </Tooltip>
            <Typography className={classes.toolbarButton} variant="body2" color="textSecondary">
                {replyCount}
            </Typography>
        </>
    );

    const renderAttachmentButton = !!comment.attachment && !attachmentOnly && (
        <Tooltip title={t('tooltips:attachment')}>
            <IconButton className={classes.toolbarButton} size="small" onClick={handleAttachmentClick}>
                <AttachFileOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderCardContent = (
        <CardContent className={classes.cardContent}>
            <Grid container justify="space-between" alignItems="center">
                {renderContentSection}
                {renderVoteSection}
            </Grid>
            <Grid container alignItems="center">
                <Grid item xs={4} container alignItems="center">
                    {renderReplyCount}
                    {renderAttachmentButton}
                </Grid>
                <Grid container item xs={4} justify="center">
                    {renderDefaultActionsButton}
                </Grid>
                <Grid item xs={4} />
            </Grid>
        </CardContent>
    );

    const renderDeleteAction = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemIcon>
                <DeleteOutline />
            </ListItemIcon>
            <ListItemText onClick={handleDeleteComment}>{t('common:delete')}</ListItemText>
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

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={handleClick}>
                {renderCardHeader}
                {renderCardContent}
                {renderActionsDrawer}
            </CardActionArea>
        </Card>
    );
};
