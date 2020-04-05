import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Drawer,
    Grid,
    IconButton,
    ListItemText,
    MenuItem,
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
import moment from 'moment';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteCommentMutation,
    useDeleteCommentMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleCommentThread, toggleFileViewer, toggleNotification } from '../../actions';
import { useTranslation } from '../../i18n';
import { mediaURL, useOptions, useVotes } from '../../utils';
import { getUser } from '../../utils/auth';
import { StyledList } from './StyledList';
import { TextLink } from './TextLink';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void;
    disableBorder?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment, isThread, removeComment, disableBorder }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = getUser();
    const created = moment(comment.created).format('LL');
    const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user) as string;
    const confirm = useConfirm();
    const attachmentOnly = comment.text == '' && comment.attachment !== '';
    const initialVote = R.propOr(null, 'vote', comment) as VoteObjectType | null;
    const initialPoints = R.propOr(0, 'points', comment) as number;
    const creatorId = R.propOr('', 'id', comment.user) as string;
    const isOwner = !!user && user.id === creatorId;
    const commentId = R.propOr('', 'id', comment) as string;
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions();
    const { onClose: handleCloseOptions, handleOpen: handleOpenOptions } = drawerProps;

    const { points, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
        initialVote,
        initialPoints,
        isOwner,
    });

    const handleClick = (): void => {
        if (isThread) {
            attachmentOnly && dispatch(toggleFileViewer(comment.attachment));
        } else {
            dispatch(toggleCommentThread(comment));
        }
    };

    const deleteCommentError = (): void => {
        dispatch(toggleNotification(t('notifications:deleteCommentError')));
    };

    const deleteCommentCompleted = ({ deleteComment }: DeleteCommentMutation): void => {
        if (!!deleteComment) {
            if (!!deleteComment.errors) {
                deleteCommentError();
            } else {
                removeComment(comment.id);
                dispatch(toggleNotification(t('notifications:commentDeleted')));
            }
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
        dispatch(toggleFileViewer(comment.attachment));
    };

    const handleDeleteComment = (e: SyntheticEvent): void => {
        handleCloseOptions(e);
        confirm({ title: t('common:deleteCommentTitle') }).then(() => deleteComment({ variables: { id: comment.id } }));
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
        <MenuItem>
            <ListItemText onClick={handleDeleteComment}>
                <DeleteOutline /> {t('common:deleteComment')}
            </ListItemText>
        </MenuItem>
    );

    return (
        <StyledCommentCard
            isThread={isThread}
            onClick={handleClick}
            disableBorder={disableBorder}
            attachmentOnly={attachmentOnly}
        >
            <CardHeader
                avatar={<Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />}
                title={renderTitle}
                subheader={created}
            />
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
                        <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                            <KeyboardArrowUpOutlined className="vote-button" />
                        </IconButton>
                        <Box>
                            <Typography variant="body2">{points}</Typography>
                        </Box>
                        <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                            <KeyboardArrowDownOutlined className="vote-button" />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" height="100%">
                            {!isThread && (
                                <>
                                    <CommentOutlined className="message-icon" />
                                    <Box marginLeft="0.25rem">
                                        <Typography variant="body2">{R.propOr('-', 'replyCount', comment)}</Typography>
                                    </Box>
                                </>
                            )}
                            {!!comment.attachment && !attachmentOnly && (
                                <Box marginLeft="0.25rem">
                                    <IconButton onClick={handleAttachmentClick}>
                                        <AttachFileOutlined />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid container item xs={4} justify="center">
                        <IconButton onClick={handleOpenOptions}>
                            <MoreHorizOutlined />
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </CardContent>
            <Drawer {...drawerProps}>
                {renderOptionsHeader}
                <StyledList>
                    {renderShareOption}
                    {renderReportOption}
                    {renderDeleteCommentOption}
                </StyledList>
            </Drawer>
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
        color: var(--dark-opacity);

        &.vote-button {
            height: 1.5rem;
            width: 1.5rem;
            color: inherit;
        }
    }
`;
