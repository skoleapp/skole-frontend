import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { Reply, ArrowDropDownOutlined, ArrowDropUpOutlined, AttachmentOutlined } from '@material-ui/icons';

import { Badge, Typography, CardHeader, Avatar, IconButton, CardContent, Grid, Box } from '@material-ui/core';
import styled from 'styled-components';
import { getAvatarThumb } from '../../utils';
import * as R from 'ramda';
import moment from 'moment';
import { TextLink } from './TextLink';
import { toggleCommentThread } from '../../actions';
import { useDispatch } from 'react-redux';

interface Props {
    comment: CommentObjectType;
    disableClick?: boolean;
}

export const CommentCard: React.FC<Props> = ({ comment, disableClick }) => {
    const dispatch = useDispatch();
    const created = moment(comment.created).format('LL');

    const handleClick = (): void => {
        !disableClick && dispatch(toggleCommentThread(comment));
    };

    const renderAction = (
        <Box display="flex" justifyContent="center" alignItems="center">
            {!!comment.attachment && (
                <Box margin="0.75rem 0.25rem 0 0">
                    <AttachmentOutlined />
                </Box>
            )}
            {!disableClick && (
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
        <StyledCommentCard onClick={handleClick}>
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

const StyledCommentCard = styled(Box)`
    cursor: pointer;

    &:hover {
        background-color: var(--hover-opacity);
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
