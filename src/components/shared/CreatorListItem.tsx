import { ListItem, ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import React from 'react';

import { UserObjectType } from '../../../generated/graphql';
import { useTranslation } from '../../i18n';
import { TextLink } from './TextLink';

export const getCreator = (creatorName?: string): string => {
    return creatorName || 'Community User';
};

interface Props {
    user: UserObjectType;
    created: string;
}

export const CreatorListItem: React.FC<Props> = ({ user, created }) => {
    const { t } = useTranslation();
    const href = !!user.id ? `/users/${user.id}` : '/';

    return (
        <ListItem>
            <ListItemText>
                <Typography variant="body2" color="textSecondary">
                    {t('common:createdBy')}{' '}
                    <TextLink href={href} color="primary">
                        {user.username || 'Community User'}
                    </TextLink>{' '}
                    {moment(created)
                        .startOf('day')
                        .fromNow()}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};
