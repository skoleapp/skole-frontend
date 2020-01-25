import React from 'react';
import { CommentObjectType } from '../../../generated/graphql';
import { Reply, ArrowDropDownOutlined, ArrowDropUpOutlined } from '@material-ui/icons';

import { Card, Badge, Typography, CardHeader, Avatar, IconButton, CardContent, Grid, Box } from '@material-ui/core';
import styled from 'styled-components';
import { getAvatarThumb } from '../../utils';
import * as R from 'ramda';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
    comment: CommentObjectType;
}

export const CommentCard: React.FC<Props> = ({ comment }) => {
    const { i18n, t } = useTranslation();
    moment.locale(i18n.language); // Set moment language.
    const created = moment(comment.created).format('LL');

    const renderAction = (
        <Box margin="1rem">
            <Badge badgeContent={R.propOr('-', 'replyCount', comment)} showZero color="primary">
                <Reply />
            </Badge>
        </Box>
    );

    return (
        <StyledCommnentCard>
            <CardHeader
                avatar={<Avatar src={getAvatarThumb(R.propOr('', 'avatarThumbnail', comment.user))} />}
                action={renderAction}
                title={R.propOr('-', 'username', comment.user)}
                subheader={`${t('common:created')}: ${created}`}
            />
            <CardContent>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={11} justify="flex-start">
                        <Typography variant="body2">{comment.text}</Typography>
                    </Grid>
                    <Grid item container xs={1} direction="column" justify="center" alignItems="flex-end">
                        <IconButton>
                            <ArrowDropUpOutlined />
                        </IconButton>
                        <Box marginRight="0.75rem">
                            <Typography variant="body2">{comment.points}</Typography>
                        </Box>
                        <IconButton>
                            <ArrowDropDownOutlined />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </StyledCommnentCard>
    );
};

const StyledCommnentCard = styled(Card)`
    .MuiCardHeader-title,
    .MuiCardHeader-subheader {
        text-align: left;
    }

    .MuiIconButton-root {
        padding: 0.25rem;
    }
`;
