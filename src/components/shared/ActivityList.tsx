import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from 'src/context';
import { mediaURL } from 'src/utils';
import { UrlObject } from 'url';

import { ActivityObjectType, UserObjectType } from '../../../generated/graphql';
import { NotFoundBox, StyledList, TextLink } from '../../components';

const getHref = ({ course, resource, comment }: ActivityObjectType): UrlObject => {
    let pathname = '#';
    let query = {};

    if (!!course) {
        pathname = `/courses/${course.id}`;
    } else if (!!resource) {
        pathname = `/resources/${resource.id}`;
    }

    if (!!comment) {
        query = { comment: comment.id };
    }

    return { pathname, query };
};

interface Props {
    slice?: number;
}

export const ActivityList: React.FC<Props> = ({ slice }) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const activity: ActivityObjectType[] = R.propOr([], 'activity', user);

    const renderAvatar = (targetUser?: UserObjectType | null): JSX.Element | false =>
        !!targetUser && (
            <ListItemAvatar>
                <Avatar src={mediaURL(R.propOr('', 'avatarThumbnail', targetUser))} />
            </ListItemAvatar>
        );

    const renderTargetUserLink = (targetUser?: UserObjectType | null): JSX.Element | '' =>
        !!targetUser ? (
            <TextLink href="/users/[id]" as={`/users/${R.propOr('', 'id', targetUser)}`}>
                {R.propOr('', 'username', targetUser)}
            </TextLink>
        ) : (
            ''
        );

    const renderActivity = activity.slice(0, slice).map(({ targetUser, description, ...activity }, i) => (
        <Link href={getHref(activity)} key={i}>
            <ListItem button className="border-bottom">
                {renderAvatar(targetUser)}
                <ListItemText primary={renderTargetUserLink(targetUser)} secondary={description} />
            </ListItem>
        </Link>
    ));

    return !!activity.length ? (
        <StyledList>{renderActivity}</StyledList>
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );
};
