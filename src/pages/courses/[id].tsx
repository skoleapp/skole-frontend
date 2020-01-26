import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, ScoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import {
    CourseDetailDocument,
    CourseObjectType,
    ResourceObjectType,
    CommentObjectType,
} from '../../../generated/graphql';
import {
    NotFound,
    StyledList,
    StyledTable,
    StyledTabs,
    TabPanel,
    TextLink,
    CommentCard,
    ResponsiveMainLayout,
} from '../../components';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getFullCourseName, useAuthSync, useTabs } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t, i18n } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const courseCode = R.propOr('-', 'code', course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorName = R.propOr('-', 'username', user) as string;
        moment.locale(i18n.language); // Set moment language.
        const created = moment(course.created).format('LL');
        const modified = moment(course.modified).format('LL');
        const points = R.propOr('-', 'points', course);
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];

        const subjectLink = {
            pathname: '/search',
            query: { subjectId: R.propOr('', 'id', subject) as boolean[] },
        };

        const renderCardHeader = <CardHeader title={fullName} />;

        const renderLeftCardContent = (
            <CardContent>
                <Box textAlign="left">
                    <Typography variant="body1">
                        {t('common:courseCode')}: {courseCode}
                    </Typography>
                    <Typography variant="body1">
                        {t('common:subject')}:{' '}
                        <TextLink href={subjectLink} color="primary">
                            {subjectName}
                        </TextLink>
                    </Typography>
                    <Typography variant="body1">
                        {t('common:school')}:{' '}
                        <TextLink href={`/schools/${R.propOr('-', 'id', school)}`} color="primary">
                            {schoolName}
                        </TextLink>
                    </Typography>
                    <Typography variant="body1">
                        {t('common:creator')}:{' '}
                        <TextLink href={`/users/${R.propOr('', 'id', user)}`} color="primary">
                            {creatorName}
                        </TextLink>
                    </Typography>
                    <Typography variant="body1">
                        {t('common:created')}: {created}
                    </Typography>
                    <Typography variant="body1">
                        {t('common:modified')}: {modified}
                    </Typography>
                </Box>
            </CardContent>
        );

        const renderRightCardContent = (
            <CardContent>
                <StyledList>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <ScoreOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            {t('common:points')}: {points}
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CloudUploadOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            {t('common:resources')}: {resourceCount}
                        </ListItemText>
                    </ListItem>
                </StyledList>
            </CardContent>
        );

        const renderTabs = (
            <>
                <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label={t('common:resources')} />
                    <Tab label={t('common:discussion')} />
                </StyledTabs>
                <TabPanel value={tabValue} index={0}>
                    {resources.length ? (
                        <StyledTable disableBoxShadow>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {t('common:title')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {t('common:points')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resources.map((r: ResourceObjectType, i: number) => (
                                        <TableRow
                                            key={i}
                                            onClick={(): Promise<boolean> => Router.push(`/resources/${r.id}`)}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle1">
                                                    {R.propOr('-', 'points', r)}
                                                </Typography>
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
                    )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <CardContent>
                        {comments.length ? (
                            comments.map((c: CommentObjectType, i: number) => <CommentCard key={i} comment={c} />)
                        ) : (
                            <Typography variant="subtitle1">{t('course:noComments')}</Typography>
                        )}
                    </CardContent>
                </TabPanel>
            </>
        );

        return (
            <ResponsiveMainLayout
                title={fullName}
                backUrl
                renderCardHeader={renderCardHeader}
                renderLeftCardContent={renderLeftCardContent}
                renderRightCardContent={renderRightCardContent}
                renderTabs={renderTabs}
            />
        );
    } else {
        return <NotFound title={t('course:notFound')} />;
    }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);
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
