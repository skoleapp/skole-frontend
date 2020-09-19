import { Avatar, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkSingleActivityReadMutation,
    useMarkSingleActivityReadMutation,
    UserObjectType,
} from 'generated';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useState } from 'react';
import { UrlObject } from 'url';
import { mediaURL, redirect, urls } from 'utils';

import { NotFoundBox } from './NotFoundBox';
import { TextLink } from './TextLink';

const useStyles = makeStyles({
    list: {
        width: '100%',
    },
    unread: {
        backgroundColor: 'rgba(173, 54, 54, 0.25)',
    },
});

const getHref = ({
    course,
    resource,
    comment,
}: Pick<ActivityObjectType, 'course' | 'resource' | 'comment'>): UrlObject => {
    let pathname = undefined;
    let query = undefined;

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
    const classes = useStyles();
    const { t } = useTranslation();
    const { userMe } = useAuthContext();
    const initialActivity: ActivityObjectType[] = R.propOr([], 'activity', userMe);
    const [activity, setActivity] = useState(initialActivity);
    const { toggleNotification } = useNotificationsContext();
    const onError = (): void => toggleNotification(t('notifications:markSingleActivityReadError'));

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
        const { pathname, query } = getHref(activity);

        try {
            await markSingleActivityRead({ variables: { id, read: true } });
            // The activities should always have a pathname but technically it's possible that the pathname is undefined.
            // In that case we do nothing besides marking the activity as read.
            !!pathname && redirect({ pathname, query });
        } catch {
            onError();
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
        <ListItem
            onClick={handleClick(activity)}
            key={i}
            button
            className={clsx('border-bottom', !!read && classes.unread)}
        >
            {renderAvatar(targetUser)}
            <ListItemText primary={renderTargetUserLink(targetUser)} secondary={description} />
        </ListItem>
    ));

    return !!activity.length ? (
        <List className={classes.list}>{renderActivity}</List>
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );
};
