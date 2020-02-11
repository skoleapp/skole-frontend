import { Avatar, Badge, Box, CardContent, CardHeader, Grid, IconButton, Typography } from '@material-ui/core';
import { ArrowDropDownOutlined, ArrowDropUpOutlined, AttachmentOutlined, Reply } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
    CommentObjectType,
    CreateVoteMutation,
    DeleteObjectMutation,
    useCreateVoteMutation,
    useDeleteObjectMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleCommentThread, toggleNotification } from '../../actions';
import { useTranslation } from '../../i18n';
import { getAvatarThumb } from '../../utils';
import { TextLink } from './TextLink';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment: initialComment, isThread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const created = moment(initialComment.created).format('LL');
    const [comment, setComment] = useState(initialComment);
    const [vote, setVote] = useState(comment.vote);

    const handleClick = (): void => {
        !isThread && dispatch(toggleCommentThread(comment));
    };

    const onCreateVoteError = (): void => {
        dispatch(toggleNotification(t('notifications:createVoteError')));
    };

    const onCreateVoteCompleted = ({ createVote }: CreateVoteMutation): void => {
        if (!!createVote) {
            if (!!createVote.errors) {
                onCreateVoteError();
            } else if (
                !!createVote.vote &&
                !!createVote.vote.status &&
                comment.points !== undefined &&
                comment.points !== null
            ) {
                setVote(createVote.vote as VoteObjectType);
                const voteStatus = createVote.vote.status;

                if (!!vote && vote.status === 1 && voteStatus === -1) {
                    setComment({ ...comment, points: comment.points - 2 }); // Decrement score by 2.
                } else if (!!vote && vote.status === -1 && voteStatus === 1) {
                    setComment({ ...comment, points: comment.points + 2 }); // Increment score by 2.
                } else {
                    setComment({ ...comment, points: comment.points + voteStatus }); // Increment/decrement score by whatever the mutation returns.
                }
            }
        }
    };

    const onDeleteVoteError = (): void => {
        dispatch(toggleNotification(t('notifications:deleteVoteError')));
    };

    const onDeleteVoteCompleted = ({ deleteObject }: DeleteObjectMutation): void => {
        if (!!deleteObject) {
            if (!!deleteObject.errors) {
                onDeleteVoteError();
            } else {
                const currentVoteStatus = !!vote && vote.status;

                if (comment.points !== undefined && comment.points !== null) {
                    if (currentVoteStatus === 1) {
                        setComment({ ...comment, points: comment.points - 1 });
                    } else if (currentVoteStatus === -1) {
                        setComment({ ...comment, points: comment.points + 1 });
                    }
                }

                setVote(null);
            }
        }
    };

    const [voteMutation, { loading: createVoteLoading }] = useCreateVoteMutation({
        onCompleted: onCreateVoteCompleted,
        onError: onCreateVoteError,
    });

    const [deleteVoteMutation, { loading: deleteVoteLoading }] = useDeleteObjectMutation({
        onCompleted: onDeleteVoteCompleted,
        onError: onDeleteVoteError,
    });

    const voteSubmitting = !!createVoteLoading || !!deleteVoteLoading;

    const handleVote = (status: number) => (e: SyntheticEvent): void => {
        e.stopPropagation();

        if ((!!vote && vote.status === 1 && status === 1) || (!!vote && vote.status === -1 && status === -1)) {
            deleteVoteMutation({ variables: { voteId: vote.id } }); // Delete existing vote.
        } else {
            voteMutation({ variables: { commentId: comment.id as number, status } }); // Create new vote.
        }
    };

    const renderAction = (
        <Box display="flex" justifyContent="center" alignItems="center">
            {!!comment.attachment && (
                <Box margin="0.75rem 0.25rem 0 0">
                    <AttachmentOutlined />
                </Box>
            )}
            {!isThread && (
                <Box margin="0.75rem 0.75rem 0 0.5rem">
                    <Badge badgeContent={R.propOr('-', 'replyCount', comment)} showZero color="primary">
                        <Reply />
                    </Badge>
                </Box>
            )}
        </Box>
    );

    const renderTitle = (
        <TextLink href={`/users/${R.propOr('', 'id', comment.user)}`}>
            {R.propOr('-', 'username', comment.user)}
        </TextLink>
    );

    return (
        <StyledCommentCard isThread={!!isThread} onClick={handleClick}>
            <CardHeader
                avatar={<Avatar src={getAvatarThumb(R.propOr('', 'avatarThumbnail', comment.user))} />}
                action={renderAction}
                title={renderTitle}
                subheader={created}
            />
            <CardContent>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item container xs={11} justify="flex-start">
                        <Typography variant="body2">{comment.text}</Typography>
                    </Grid>
                    <Grid item container xs={1} direction="column" justify="center" alignItems="flex-end">
                        <IconButton
                            onClick={handleVote(1)}
                            color={!!vote && vote.status === 1 ? 'primary' : 'inherit'}
                            disabled={voteSubmitting}
                        >
                            <ArrowDropUpOutlined />
                        </IconButton>
                        <Box margin="0.25rem 0.6rem">
                            <Typography variant="body2">{comment.points}</Typography>
                        </Box>
                        <IconButton
                            onClick={handleVote(-1)}
                            color={!!vote && vote.status === -1 ? 'primary' : 'inherit'}
                            disabled={voteSubmitting}
                        >
                            <ArrowDropDownOutlined />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
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

    .MuiCardHeader-root,
    .MuiCardContent-root {
        padding: 0.5rem;
    }

    .MuiCardHeader-title,
    .MuiCardHeader-subheader {
        text-align: left;
    }

    .MuiCardHeader-subheader {
        font-size: 0.75rem;
    }

    .MuiCardHeader-action {
        padding: 0.5rem;
    }

    .MuiAvatar-root {
        height: 1.75rem;
        width: 1.75rem;
    }

    .MuiIconButton-root {
        padding: 0.25rem;
    }

    .MuiSvgIcon-root {
        height: 1.25rem;
        width: 1.25rem;
    }
`;
