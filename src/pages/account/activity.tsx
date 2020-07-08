import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from 'src/context';
import { mediaURL } from 'src/utils';

import { ActivityObjectType, UserObjectType } from '../../../generated/graphql';
import { NotFoundBox, NotFoundLayout, SettingsLayout, StyledList, TextLink } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withAuthSync, withSSRAuth, withUserAgent } from '../../lib';
import { I18nProps } from '../../types';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const getHref = ({ course, resource, comment }): UrlObject => {
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

const ActivityPage: NextPage<Props> = () => {
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

    const renderActivity = activity.map(({ targetUser, description, ...activity }, i) => (
        <Link href={getHref(activity)} key={i}>
            <ListItem button className="border-bottom">
                {renderAvatar(targetUser)}
                <ListItemText primary={renderTargetUserLink(targetUser)} secondary={description} />
            </ListItem>
        </Link>
    ));

    const renderCardContent = !!activity.length ? (
        <StyledList>{renderActivity}</StyledList>
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );

    const layoutProps = {
        seoProps: {
            title: t('activity:title'),
            description: t('activity:description'),
        },
        topNavbarProps: {
            header: t('activity:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('activity:header'),
        fullSize: true,
    };

    if (!!user) {
        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['activity']),
    },
}));

export default withAuthSync(ActivityPage);
