import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@material-ui/core';
import {
    CloudUploadOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    ScoreOutlined,
} from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import { CommentObjectType, ResourceDetailDocument, ResourceObjectType } from '../../../generated/graphql';
import { DiscussionLayout, FilePreview, NotFound, TextLink } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { mediaURL, usePrivatePage } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { t } = useTranslation();

    if (resource) {
        const title = R.propOr('-', 'title', resource) as string;
        const file = mediaURL(resource.file);
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('-', 'id', resource.course) as string;
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user) as string;
        const creatorName = R.propOr('-', 'username', resource.user) as string;
        const created = moment(resource.created).format('LL');
        const points = R.propOr('-', 'points', resource);
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
        };

        const createdInfoProps = { creatorId, creatorName, created };

        const renderInfo = (
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CloudUploadOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:resourceType')}: {resourceType}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SchoolOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:course')}:{' '}
                                <TextLink href={`/courses/${courseId}`} color="primary">
                                    {courseName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <LibraryAddOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:school')}:{' '}
                                <TextLink href={`/schools/${schoolId}`} color="primary">
                                    {schoolName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <ScoreOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:points')}: {points}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            </CardContent>
        );

        const renderCustomBottomNavbar = (
            <BottomNavigation>
                <BottomNavigationAction icon={<KeyboardArrowUpOutlined />} />
                <BottomNavigationAction icon={<KeyboardArrowDownOutlined />} />
            </BottomNavigation>
        );

        return (
            <DiscussionLayout
                title={title}
                backUrl
                renderMobileInfo={renderInfo}
                customBottomNavbar={renderCustomBottomNavbar}
                tabLabel={t('common:resource')}
                renderMainContent={<FilePreview file={file} />}
                discussionBoxProps={discussionBoxProps}
                createdInfoProps={createdInfoProps}
            />
        );
    } else {
        return <NotFound title={t('resource:notFound')} />;
    }
};

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    const { query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['resource']) };

    try {
        const { data } = await ctx.apolloClient.query({
            query: ResourceDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(ResourceDetailPage);
