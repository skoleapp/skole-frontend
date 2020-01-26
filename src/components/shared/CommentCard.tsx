import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { Reply, ArrowDropDownOutlined, ArrowDropUpOutlined } from '@material-ui/icons';

import {
    Card,
    Badge,
    Typography,
    CardHeader,
    Avatar,
    IconButton,
    CardContent,
    Grid,
    Box,
    Divider,
} from '@material-ui/core';
import styled from 'styled-components';
import { getAvatarThumb } from '../../utils';
import * as R from 'ramda';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { TextLink } from './TextLink';
import { toggleCommentThread } from '../../actions';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

interface Props {
    comment: CommentObjectType;
}

export const CommentCard: React.FC<Props> = ({ comment }) => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    moment.locale(i18n.language); // Set moment language.
    const created = moment(comment.created).format('LL');
    const handleClick = (): AnyAction => dispatch((toggleCommentThread(comment) as unknown) as AnyAction);

    const renderAction = (
        <Badge badgeContent={R.propOr('-', 'replyCount', comment)} showZero color="primary">
            <Reply />
        </Badge>
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
            <Divider />
            <CardContent>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={11} justify="flex-start">
                        <Typography variant="body2">{comment.text}</Typography>
                    </Grid>
                    <Grid item container xs={1} direction="column" justify="center" alignItems="flex-end">
                        <IconButton>
                            <ArrowDropUpOutlined />
                        </IconButton>
                        <Box margin="0.25rem 0.75rem">
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

const StyledCommentCard = styled(Card)`
    cursor: pointer;

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
        margin: 0.75rem 0.75rem 0 0;
    }

    .MuiAvatar-root {
        height: 1.75rem;
        width: 1.75rem;
    }

    .MuiIconButton-root {
        padding: 0.25rem;
    }
`;
