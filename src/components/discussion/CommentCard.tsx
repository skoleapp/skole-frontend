import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    ListItemText,
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
import { useAttachmentViewerContext, useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { CommentObjectType, DeleteCommentMutation, useDeleteCommentMutation, VoteObjectType } from 'generated';
import { useActionsDrawer, useMoment, useVotes } from 'hooks';
import { useConfirm } from 'material-ui-confirm';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { mediaURL } from 'utils';

import { StyledDrawer, StyledList, TextLink } from '..';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void;
    disableBorder?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment, isThread, removeComment, disableBorder }) => {
    const { t } = useTranslation();
    const { user, verified, verificationRequiredTooltip } = useAuthContext();
    const moment = useMoment();
    const created = moment(comment.created).format('LL');
    const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user) as string;
    const confirm = useConfirm();
    const attachmentOnly = comment.text == '' && comment.attachment !== '';
    const initialVote = R.propOr(null, 'vote', comment) as VoteObjectType | null;
    const initialScore = String(R.propOr(0, 'score', comment));
    const creatorId = R.propOr('', 'id', comment.user) as string;
    const isOwner = !!user && user.id === creatorId;
    const commentId = R.propOr('', 'id', comment) as string;
    const replyComments: CommentObjectType[] = R.propOr([], 'replyComments', comment);
    const replyCount = replyComments.length;
    const { toggleNotification } = useNotificationsContext();
    const { toggleAttachmentViewer } = useAttachmentViewerContext();
    const { toggleTopComment } = useDiscussionContext();

    const {
        renderActionsHeader,
        handleCloseActions,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        open,
        anchor,
    } = useActionsDrawer();

    const actionsDrawerProps = { open, anchor, onClose: handleCloseActions };

    const upVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnComment')
        : t('tooltips:upVote');

    const downVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnComment')
        : t('tooltips:downVote');

    const { score, upVoteButtonProps, downVoteButtonProps } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { comment: commentId },
        upVoteButtonTooltip,
        downVoteButtonTooltip,
    });

    const handleClick = (): void => {
        if (isThread) {
            attachmentOnly && toggleAttachmentViewer(comment.attachment);
        } else {
            toggleTopComment(comment);
        }
    };

    const deleteCommentError = (): void => toggleNotification(t('notifications:deleteCommentError'));

    const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
        if (!!deleteComment) {
            if (!!deleteComment.errors) {
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
    });

    const handleAttachmentClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        toggleAttachmentViewer(comment.attachment);
    };

    const handleDeleteComment = async (e: SyntheticEvent): Promise<void> => {
        handleCloseActions(e);

        try {
            await confirm({ title: t('common:deleteCommentTitle'), description: t('common:deleteCommentDescription') });
            deleteComment({ variables: { id: comment.id } });
        } catch {
            // User cancelled.
        }
    };

    const renderTitle = (
        <TextLink
            href={`/users/${R.propOr('', 'id', comment.user)}`}
            onClick={(e: SyntheticEvent): void => e.stopPropagation()}
        >
            {R.propOr('-', 'username', comment.user)}
        </TextLink>
    );

    const renderCardHeader = (
        <CardHeader
            avatar={<Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />}
            title={renderTitle}
            subheader={created}
        />
    );

    const renderContentSection = (
        <Grid id="content" item container xs={11} justify="flex-start">
            {attachmentOnly ? (
                <Box display="flex">
                    <CameraAltOutlined />
                    <Box marginLeft="0.5rem">
                        <Typography variant="body2">{t('common:clickToView')}</Typography>
                    </Box>
                </Box>
            ) : (
                <Typography variant="body2">{comment.text}</Typography>
            )}
        </Grid>
    );

    const renderVoteSection = (
        <Grid item container xs={1} direction="column" justify="center" alignItems="center">
            <Tooltip title={upVoteButtonTooltip}>
                <span>
                    <IconButton {...upVoteButtonProps}>
                        <KeyboardArrowUpOutlined className="vote-button" />
                    </IconButton>
                </span>
            </Tooltip>
            <Box>
                <Typography variant="body2">{score}</Typography>
            </Box>
            <Tooltip title={downVoteButtonTooltip}>
                <span>
                    <IconButton {...downVoteButtonProps}>
                        <KeyboardArrowDownOutlined className="vote-button" />
                    </IconButton>
                </span>
            </Tooltip>
        </Grid>
    );

    const renderReplyCount = !isThread && (
        <>
            <Tooltip title={t('tooltips:commentReplies', { replyCount })}>
                <CommentOutlined className="message-icon" />
            </Tooltip>
            <Box marginLeft="0.25rem">
                <Typography variant="body2">{replyCount}</Typography>
            </Box>
        </>
    );

    const renderAttachmentButton = !!comment.attachment && !attachmentOnly && (
        <Box marginLeft="0.25rem">
            <Tooltip title={t('tooltips:attachment')}>
                <IconButton onClick={handleAttachmentClick}>
                    <AttachFileOutlined />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const renderCardContent = (
        <CardContent>
            <Grid container justify="space-between" alignItems="center">
                {renderContentSection}
                {renderVoteSection}
            </Grid>
            <Grid container>
                <Grid item xs={4}>
                    <Box display="flex" alignItems="center" height="100%">
                        {renderReplyCount}
                        {renderAttachmentButton}
                    </Box>
                </Grid>
                <Grid container item xs={4} justify="center">
                    {renderActionsButton}
                </Grid>
                <Grid item xs={4} />
            </Grid>
        </CardContent>
    );

    const renderDeleteAction = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemText onClick={handleDeleteComment}>
                <DeleteOutline /> {t('common:delete')}
            </ListItemText>
        </MenuItem>
    );

    const renderActions = (
        <StyledList>
            {renderShareAction}
            {renderDeleteAction}
            {renderReportAction}
        </StyledList>
    );

    const renderActionsDrawer = (
        <StyledDrawer {...actionsDrawerProps}>
            {renderActionsHeader}
            {renderActions}
        </StyledDrawer>
    );

    return (
        <StyledCommentCard
            isThread={isThread}
            onClick={handleClick}
            disableBorder={disableBorder}
            attachmentOnly={attachmentOnly}
        >
            {renderCardHeader}
            {renderCardContent}
            {renderActionsDrawer}
        </StyledCommentCard>
    );
};

// Ignore: isThread, disableBorder and attachmentOnly must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledCommentCard = styled(({ isThread, disableBorder, attachmentOnly, ...other }) => <Box {...other} />)`
    border-bottom: ${({ disableBorder }): string => (!disableBorder ? 'var(--border)' : 'none')};

    // Disable hover background color and cursor mode when on message thread.
    &:hover {
        cursor: ${({ isThread, attachmentOnly }): string => {
            return attachmentOnly ? 'pointer' : !isThread ? 'pointer' : 'inherit';
        }};

        background-color: ${({ isThread, attachmentOnly }): string => {
            return !isThread ? 'var(--hover-color)' : attachmentOnly ? 'var(--hover-color)' : 'inherit';
        }};
    }

    .MuiCardContent-root {
        padding: 0.5rem !important;

        #content {
            padding: 0.5rem;

            .MuiTypography-root {
                overflow: hidden;
                word-break: break-word;
                text-align: left;
            }
        }
    }

    .MuiCardHeader-content {
        display: flex;

        .MuiCardHeader-subheader {
            margin-left: 1rem;
        }
    }

    .MuiIconButton-root {
        padding: 0.25rem;
    }

    .MuiSvgIcon-root {
        height: 1.25rem;
        width: 1.25rem;
        color: var(--opacity-dark);

        &.vote-button {
            height: 1.5rem;
            width: 1.5rem;
            color: inherit;
        }
    }
`;
