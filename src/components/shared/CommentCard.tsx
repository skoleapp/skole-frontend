import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    ListItemText,
    MenuItem,
    SwipeableDrawer,
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
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteCommentMutation,
    PerformVoteMutation,
    useDeleteCommentMutation,
    usePerformVoteMutation,
    UserObjectType,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleCommentThread, toggleFileViewer, toggleNotification } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { mediaURL, useOptions } from '../../utils';
import { StyledList } from './StyledList';
import { TextLink } from './TextLink';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void;
    disableBorder?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment: initialComment, isThread, removeComment, disableBorder }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state: State) => state.auth);
    const created = moment(initialComment.created).format('LL');
    const [comment, setComment] = useState(initialComment);
    const [vote, setVote] = useState(comment.vote);
    const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user) as string;
    const confirm = useConfirm();
    const attachmentOnly = comment.text == '' && comment.attachment !== '';

    const {
        openOptions,
        closeOptions,
        renderShareOption,
        renderReportOption,
        mobileDrawerProps,
        desktopDrawerProps,
        renderOptionsHeader,
    } = useOptions();

    const handleClick = (): void => {
        if (isThread) {
            attachmentOnly && dispatch(toggleFileViewer(comment.attachment));
        } else {
            dispatch(toggleCommentThread(comment));
        }
    };

    const performVoteError = (): void => {
        dispatch(toggleNotification(t('notifications:voteError')));
    };

    const deleteCommentError = (): void => {
        dispatch(toggleNotification(t('notifications:deleteCommentError')));
    };

    const performVoteCompleted = ({ performVote }: PerformVoteMutation): void => {
        if (!!performVote) {
            if (!!performVote.errors) {
                performVoteError();
            } else {
                setVote(performVote.vote as VoteObjectType);
                setComment({ ...comment, points: performVote.targetPoints });
            }
        }
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

    const [performVote, { loading: voteSubmitting }] = usePerformVoteMutation({
        onCompleted: performVoteCompleted,
        onError: performVoteError,
    });

    const [deleteComment] = useDeleteCommentMutation({
        onCompleted: deleteCommentCompleted,
        onError: deleteCommentError,
    });

    const handleVote = (status: number) => (e: SyntheticEvent): void => {
        e.stopPropagation();
        performVote({ variables: { comment: comment.id, status } });
    };

    const handleAttachmentClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        dispatch(toggleFileViewer(comment.attachment));
    };

    const handleDeleteComment = (e: SyntheticEvent): void => {
        e.stopPropagation();
        closeOptions();
        confirm({ title: t('common:deleteCommentTitle') }).then(() => deleteComment({ variables: { id: comment.id } }));
    };

    const handleMoreClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        openOptions();
    };

    const renderTitle = (
        <TextLink
            href={`/users/${R.propOr('', 'id', comment.user)}`}
            onClick={(e: SyntheticEvent): void => e.stopPropagation()}
        >
            {R.propOr('-', 'username', comment.user)}
        </TextLink>
    );

    const renderDeleteCommentOption = R.prop('id', comment.user as UserObjectType) ===
        R.prop('id', user as UserObjectType) && (
        <MenuItem>
            <ListItemText onClick={handleDeleteComment}>
                <DeleteOutline /> {t('common:deleteComment')}
            </ListItemText>
        </MenuItem>
    );

    const renderOptionDrawerContent = (
        <StyledList>
            {renderOptionsHeader}
            {renderShareOption}
            {renderReportOption}
            {renderDeleteCommentOption}
        </StyledList>
    );

    const renderMobileCommentOptions = (
        <SwipeableDrawer {...mobileDrawerProps}>{renderOptionDrawerContent}</SwipeableDrawer>
    );

    const renderDesktopCommentOptions = (
        <SwipeableDrawer {...desktopDrawerProps}>{renderOptionDrawerContent}</SwipeableDrawer>
    );

    return (
        <StyledCommentCard
            isThread={isThread}
            onClick={handleClick}
            disableBorder={disableBorder}
            attachmentOnly={attachmentOnly}
        >
            <CardHeader avatar={<Avatar src={mediaURL(avatarThumb)} />} title={renderTitle} subheader={created} />
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
                        <IconButton
                            onClick={handleVote(1)}
                            color={!!vote && vote.status === 1 ? 'primary' : 'inherit'}
                            disabled={voteSubmitting}
                        >
                            <KeyboardArrowUpOutlined className="vote-button" />
                        </IconButton>
                        <Box>
                            <Typography variant="body2">{comment.points}</Typography>
                        </Box>
                        <IconButton
                            onClick={handleVote(-1)}
                            color={!!vote && vote.status === -1 ? 'primary' : 'inherit'}
                            disabled={voteSubmitting}
                        >
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
                        <IconButton onClick={handleMoreClick}>
                            <MoreHorizOutlined />
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </CardContent>
            {renderMobileCommentOptions}
            {renderDesktopCommentOptions}
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
            }
        }
    }

    .MuiAvatar-root {
        height: 1.5rem;
        width: 1.5rem;
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
