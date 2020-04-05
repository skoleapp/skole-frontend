import { ListItem, ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';

import { UserObjectType } from '../../../generated/graphql';
import { useTranslation } from '../../i18n';
import { TextLink } from './TextLink';

export const getCreator = (creatorName?: string): string => {
    return creatorName || 'Community User';
};

interface Props {
    user: UserObjectType | null;
    created: string;
}

export const CreatorListItem: React.FC<Props> = ({ user, created }) => {
    const { t } = useTranslation();
    const userId = R.propOr(undefined, 'id', user);
    const username = R.propOr('Community User', 'username', user) as string;

    return (
        <ListItem>
            <ListItemText>
                <Typography variant="body2" color="textSecondary">
                    {t('common:createdBy')}{' '}
                    <TextLink href="/users/[id]" as={!!userId ? `/users/${userId}` : '/users'} color="primary">
                        {username}
                    </TextLink>{' '}
                    {moment(created)
                        .startOf('day')
                        .fromNow()}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};
