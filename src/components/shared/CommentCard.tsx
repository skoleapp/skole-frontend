import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import {
    AttachFileOutlined,
    CommentOutlined,
    DeleteOutline,
    FlagOutlined,
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
import { toggleCommentThread, toggleNotification } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { mediaURL } from '../../utils/mediaURL';
import { TextLink } from './TextLink';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
    removeComment: (id: string) => void;
}

export const CommentCard: React.FC<Props> = ({ comment: initialComment, isThread, removeComment }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state: State) => state.auth);
    const created = moment(initialComment.created).format('LL');
    const [comment, setComment] = useState(initialComment);
    const [vote, setVote] = useState(comment.vote);
    const avatarThumb = R.propOr('', 'avatarThumbnail', comment.user) as string;
    const [commentOptionsOpen, setCommentOptionsOpen] = useState(false);
    const confirm = useConfirm();

    const handleCloseCommentOptions = (e: SyntheticEvent): void => {
        e.stopPropagation();
        setCommentOptionsOpen(false);
    };

    const handleClick = (): void => {
        !isThread && dispatch(toggleCommentThread(comment));
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
        console.log('Attachment clicked!');
    };

    const handleMoreClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        setCommentOptionsOpen(true);
    };

    const handleDeleteComment = (e: SyntheticEvent): void => {
        e.stopPropagation();
        setCommentOptionsOpen(false);

        confirm({ title: t('common:deleteCommentTitle') }).then(() => deleteComment({ variables: { id: comment.id } }));
    };

    const handleStopPropagation = (e: SyntheticEvent): void => e.stopPropagation();

    const renderTitle = (
        <TextLink href={`/users/${R.propOr('', 'id', comment.user)}`}>
            {R.propOr('-', 'username', comment.user)}
        </TextLink>
    );

    const renderCommentOptionsDialog = (
        <Dialog open={commentOptionsOpen} onClose={handleCloseCommentOptions}>
            <DialogTitle onClick={handleStopPropagation}>{t('common:commentActions')}</DialogTitle>
            {R.prop('id', comment.user as UserObjectType) === R.prop('id', user as UserObjectType) && (
                <ListItem>
                    <ListItemText onClick={handleDeleteComment}>
                        <DeleteOutline /> {t('common:deleteComment')}
                    </ListItemText>
                </ListItem>
            )}
            <ListItem disabled>
                <ListItemText onClick={handleStopPropagation}>
                    <FlagOutlined /> {t('common:reportAbuse')}
                </ListItemText>
            </ListItem>
        </Dialog>
    );

    return (
        <StyledCommentCard isThread={!!isThread} onClick={handleClick}>
            <CardHeader avatar={<Avatar src={mediaURL(avatarThumb)} />} title={renderTitle} subheader={created} />
            <CardContent>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item container xs={11} justify="flex-start">
                        <Typography variant="body2">{comment.text}</Typography>
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
                            <Box marginLeft="0.25rem">
                                <IconButton onClick={handleAttachmentClick}>
                                    <AttachFileOutlined />
                                </IconButton>
                            </Box>
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
            {renderCommentOptionsDialog}
        </StyledCommentCard>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledCommentCard = styled(({ isThread, ...other }) => <Box {...other} />)`
    // Disable hover background color and cursor mode when on message thread.
    &:hover {
        cursor: ${({ isThread }): string => (!isThread ? 'pointer' : 'inherit')};
        background-color: ${({ isThread }): string => (!isThread ? 'var(--hover-opacity)' : 'inherit')};
    }

    .MuiCardContent-root {
        padding: 0.5rem !important;
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
