import { ListItem, ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';

import { UserObjectType } from '../../../generated/graphql';
import { useTranslation } from '../../i18n';
import { TextLink } from './TextLink';

interface Props {
    user?: UserObjectType | null;
    created: string;
}

export const CreatorListItem: React.FC<Props> = ({ user, created }) => {
    const { t } = useTranslation();
    const userId = R.propOr(undefined, 'id', user);

    return (
        <ListItem>
            <ListItemText>
                <Typography variant="body2" color="textSecondary">
                    {t('common:createdBy')}{' '}
                    {!!userId ? (
                        <TextLink href="/users/[id]" as={`/users/${userId}`} color="primary">
                            {R.propOr('-', 'username', user)}
                        </TextLink>
                    ) : (
                        <TextLink href="/users">{t('common:communityUser')}</TextLink>
                    )}{' '}
                    {moment(created)
                        .startOf('day')
                        .fromNow()}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};
