import { Avatar, Badge, Box, CardContent, CardHeader, Grid, IconButton, Typography } from '@material-ui/core';
import { ArrowDropDownOutlined, ArrowDropUpOutlined, AttachmentOutlined, Reply } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType } from '../../../generated/graphql';
import { toggleCommentThread } from '../../actions';
import { getAvatarThumb } from '../../utils';
import { TextLink } from './TextLink';

interface Props {
    comment: CommentObjectType;
    isThread?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment, isThread }) => {
    const dispatch = useDispatch();
    const created = moment(comment.created).format('LL');

    const handleClick = (): void => {
        !isThread && dispatch(toggleCommentThread(comment));
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
                        <IconButton>
                            <ArrowDropUpOutlined />
                        </IconButton>
                        <Box margin="0.25rem 0.6rem">
                            <Typography variant="body2">{comment.points}</Typography>
                        </Box>
                        <IconButton>
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
