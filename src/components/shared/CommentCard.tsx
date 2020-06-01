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
    MoreHorizOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteCommentMutation,
    useDeleteCommentMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    useAttachmentViewerContext,
    useAuthContext,
    useCommentThreadContext,
    useNotificationsContext,
} from '../../context';
import { mediaURL, useMoment, useOptions, useVotes } from '../../utils';
import { StyledDrawer } from './StyledDrawer';
import { StyledList } from './StyledList';
import { TextLink } from './TextLink';
interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void;
    disableBorder?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment, isThread, removeComment, disableBorder }) => {
    const { t } = useTranslation();
    const { user, verified, notVerifiedTooltip } = useAuthContext();
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
    const replyCount = R.propOr('', 'replyCount', comment) as string;

    const {
        renderShareOption,
        renderReportOption,
        renderOptionsHeader,
        drawerProps: { handleOpen: handleOpenOptions, ...drawerProps },
    } = useOptions();

    const { onClose: handleCloseOptions } = drawerProps;
    const { toggleNotification } = useNotificationsContext();
    const { toggleAttachmentViewer } = useAttachmentViewerContext();
    const { toggleCommentThread } = useCommentThreadContext();

    const { score, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
        initialVote,
        initialScore,
        isOwner,
    });

    const upVoteButtonTooltip = !!notVerifiedTooltip
        ? notVerifiedTooltip
        : isOwner
        ? t('common:ownCommentVoteTooltip')
        : t('common:upvoteCommentTooltip');

    const downVoteButtonTooltip = !!notVerifiedTooltip
        ? notVerifiedTooltip
        : isOwner
        ? t('common:ownCommentVoteTooltip')
        : t('common:downvoteCommentTooltip');

    const handleClick = (): void => {
        if (isThread) {
            attachmentOnly && toggleAttachmentViewer(comment.attachment);
        } else {
            toggleCommentThread(comment);
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

    const handleVoteClick = (status: number) => (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleVote({ status: status, course: commentId });
    };

    const handleAttachmentClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        toggleAttachmentViewer(comment.attachment);
    };

    const handleDeleteComment = async (e: SyntheticEvent): Promise<void> => {
        try {
            await confirm({ title: t('common:deleteCommentTitle') });
            deleteComment({ variables: { id: comment.id } });
        } catch {
        } finally {
            handleCloseOptions(e);
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

    const renderDeleteCommentOption = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemText onClick={handleDeleteComment}>
                <DeleteOutline /> {t('common:deleteComment')}
            </ListItemText>
        </MenuItem>
    );

    const renderCardHeader = (
        <CardHeader
            avatar={<Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />}
            title={renderTitle}
            subheader={created}
        />
    );

    const renderCardContent = (
        <CardContent>
            <Grid container justify="space-between" alignItems="center">
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
                <Grid item container xs={1} direction="column" justify="center" alignItems="center">
                    <Tooltip title={upVoteButtonTooltip}>
                        <span>
                            <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                                <KeyboardArrowUpOutlined className="vote-button" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Box>
                        <Typography variant="body2">{score}</Typography>
                    </Box>
                    <Tooltip title={downVoteButtonTooltip}>
                        <span>
                            <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                                <KeyboardArrowDownOutlined className="vote-button" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={4}>
                    <Box display="flex" alignItems="center" height="100%">
                        {!isThread && (
                            <>
                                <Tooltip title={t('common:commentRepliesTooltip', { replyCount })}>
                                    <CommentOutlined className="message-icon" />
                                </Tooltip>
                                <Box marginLeft="0.25rem">
                                    <Typography variant="body2">{replyCount}</Typography>
                                </Box>
                            </>
                        )}
                        {!!comment.attachment && !attachmentOnly && (
                            <Box marginLeft="0.25rem">
                                <Tooltip title={t('common:commentAttachmentTooltip')}>
                                    <IconButton onClick={handleAttachmentClick}>
                                        <AttachFileOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid container item xs={4} justify="center">
                    <Tooltip title={t('common:commentOptionsTooltip')}>
                        <IconButton onClick={handleOpenOptions}>
                            <MoreHorizOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={4} />
            </Grid>
        </CardContent>
    );

    const renderOptions = (
        <StyledDrawer {...drawerProps}>
            {renderOptionsHeader}
            <StyledList>
                {renderShareOption}
                {renderReportOption}
                {renderDeleteCommentOption}
            </StyledList>
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
            {renderOptions}
        </StyledCommentCard>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledCommentCard = styled(({ isThread, disableBorder, attachmentOnly, ...other }) => <Box {...other} />)`
    border-bottom: ${({ disableBorder }): string => (!disableBorder ? 'var(--border)' : 'none')};

    // Disable hover background color and cursor mode when on message thread.
    &:hover {
        cursor: ${({ isThread, attachmentOnly }): string => {
            return attachmentOnly ? 'pointer' : !isThread ? 'pointer' : 'inherit';
        }};

        background-color: ${({ isThread, attachmentOnly }): string => {
            return !isThread ? 'var(--hover-opacity)' : attachmentOnly ? 'var(--hover-opacity)' : 'inherit';
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
        font-size: 0.65rem;

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
