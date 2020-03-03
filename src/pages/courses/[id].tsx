import {
    Avatar,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined, SubjectOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import {
    CommentObjectType,
    CourseDetailDocument,
    CourseObjectType,
    ResourceObjectType,
} from '../../../generated/graphql';
import { DiscussionBox, NotFound, StyledTable, TabLayout, TextLink } from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getFullCourseName, usePrivatePage } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorId = R.propOr('', 'id', course.user) as string;
        const creatorName = R.propOr('-', 'username', user) as string;
        const points = R.propOr('-', 'points', course);
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];

        const created = moment(course.created)
            .startOf('day')
            .fromNow();

        const subjectLink = {
            pathname: '/search',
            query: { subjectId: R.propOr('', 'id', subject) as boolean[] },
        };

        const discussionBoxProps = {
            comments,
            target: { course: Number(course.id) },
        };

        const createdInfoProps = { creatorId, creatorName, created };

        const renderInfo = (
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SubjectOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:subject')}:{' '}
                                <TextLink href={subjectLink} color="primary">
                                    {subjectName}
                                </TextLink>
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
                                {t('common:school')}:{' '}
                                <TextLink href={`/schools/${R.propOr('-', 'id', school)}`} color="primary">
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
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CloudUploadOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:resources')}: {resourceCount}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            </CardContent>
        );

        const renderResources = resources.length ? (
            <StyledTable disableBoxShadow>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t('common:title')}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t('common:points')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resources.map((r: ResourceObjectType, i: number) => (
                            <TableRow key={i} onClick={(): Promise<boolean> => Router.push(`/resources/${r.id}`)}>
                                <TableCell>
                                    <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('course:noResources')}</Typography>
            </CardContent>
        );

        return (
            <TabLayout
                title={fullName}
                titleSecondary={t('common:discussion')}
                backUrl
                renderMobileInfo={renderInfo}
                renderDesktopInfo={renderInfo}
                tabLabelLeft={t('common:resources')}
                renderLeftContent={renderResources}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                createdInfoProps={createdInfoProps}
            />
        );
    } else {
        return <NotFound title={t('course:notFound')} />;
    }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
    const { apolloClient, query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['course']) };

    try {
        const { data } = await apolloClient.query({
            query: CourseDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(CourseDetailPage);
