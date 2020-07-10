import { Avatar, Box, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkSingleActivityReadMutation,
    useMarkSingleActivityReadMutation,
    UserObjectType,
} from 'generated';
import { Router } from 'i18n';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { mediaURL, urls } from 'utils';

import { StyledList } from '..';
import { NotFoundBox, TextLink } from '.';

const getHref = ({
    course,
    resource,
    comment,
}: Pick<ActivityObjectType, 'course' | 'resource' | 'comment'>): UrlObject => {
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
    const initialActivity: ActivityObjectType[] = R.propOr([], 'activity', user);
    const [activity, setActivity] = useState(initialActivity);
    const { toggleNotification } = useNotificationsContext();
    const onError = (): void => toggleNotification(t('errors:activityError'));

    // Automatically update activity state when user context gets updated.
    useEffect(() => {
        const updatedActivity: ActivityObjectType[] = R.propOr([], 'activity', user);
        setActivity(updatedActivity);
    }, [user]);

    const onCompleted = ({ markActivityRead }: MarkSingleActivityReadMutation): void => {
        if (!!markActivityRead) {
            if (!!markActivityRead.errors) {
                onError();
            } else if (!!markActivityRead.activity) {
                const { activity: updatedActivityItem } = markActivityRead;
                const newActivity = activity.map(a => (a.id === updatedActivityItem.id ? updatedActivityItem : a));
                setActivity(newActivity as ActivityObjectType[]);
            } else {
                onError();
            }
        } else {
            onError();
        }
    };

    const [markSingleActivityRead] = useMarkSingleActivityReadMutation({ onCompleted, onError });

    const handleClick = ({ id, ...activity }: ActivityObjectType) => async (): Promise<void> => {
        const href = getHref(activity);

        try {
            await markSingleActivityRead({ variables: { id, read: true } });
            Router.push(href);
        } catch {
            toggleNotification(t('errors:activityError'));
        }
    };

    const renderAvatar = (targetUser?: UserObjectType | null): JSX.Element | false =>
        !!targetUser && (
            <ListItemAvatar>
                <Avatar src={mediaURL(R.propOr('', 'avatarThumbnail', targetUser))} />
            </ListItemAvatar>
        );

    const renderTargetUserLink = (targetUser?: UserObjectType | null): JSX.Element | '' =>
        !!targetUser ? (
            <TextLink href={urls.user} as={`/users/${R.propOr('', 'id', targetUser)}`}>
                {R.propOr('', 'username', targetUser)}
            </TextLink>
        ) : (
            ''
        );

    const renderActivity = activity.slice(0, slice).map(({ targetUser, description, read, ...activity }, i) => (
        <StyledListItem onClick={handleClick(activity)} key={i} button className="border-bottom" read={read}>
            {renderAvatar(targetUser)}
            <ListItemText primary={renderTargetUserLink(targetUser)} secondary={description} />
        </StyledListItem>
    ));

    return !!activity.length ? (
        <Box position="relative" flexGrow="1" display="flex">
            <StyledActivityList flexGrow="1" display="flex">
                <StyledList>{renderActivity}</StyledList>
            </StyledActivityList>
        </Box>
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );
};

const StyledActivityList = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;

    .MuiList-root {
        flex-grow: 1;
        overflow-y: scroll;
    }
`;

// Ignore: topComment must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledListItem = styled(({ read, ...props }) => <ListItem {...props} />)`
    // Show unread notifications with light shade of primary color.
    background-color: ${({ read }): string => (read ? 'default' : 'rgba(173, 54, 54, 0.25)')} !important;
`;
