import {
    Avatar,
    CardContent,
    CardHeader,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Grid,
    Box,
    Divider,
    Tab,
} from '@material-ui/core';
import {
    CloudUploadOutlined,
    ScoreOutlined,
    AccountCircleOutlined,
    SubjectOutlined,
    SchoolOutlined,
} from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
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
    TextLink,
    StyledCard,
    MainLayout,
    StyledTabs,
    TabPanel,
    DiscussionBox,
} from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getFullCourseName, useAuthSync, useTabs } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorName = R.propOr('-', 'username', user) as string;
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

        const renderCourseInfo = (
            <CardContent>
                <StyledList>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <AccountCircleOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body1">
                                {t('common:creator')}:{' '}
                                <TextLink href={`/users/${R.propOr('', 'id', user)}`} color="primary">
                                    {creatorName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SubjectOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body1">
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
                            <Typography variant="body1">
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
                <Box textAlign="left">
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:created')} {created}
                    </Typography>
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:modified')} {modified}
                    </Typography>
                </Box>
            </CardContent>
        );

        const renderResources = resources.length ? (
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

        const renderMobileContent = (
            <Grid className="md-down" container>
                <Grid item xs={12}>
                    {renderCourseInfo}
                    <Divider />
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
                        {renderResources}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <DiscussionBox comments={comments} />
                    </TabPanel>
                </Grid>
            </Grid>
        );

        const renderDesktopContent = (
            <Box className="md-up" display="flex" flexGrow="1">
                <Grid container xs={12} md={7} lg={8}>
                    <StyledCard>
                        <CardHeader title={fullName} />
                        <Divider />
                        {renderCourseInfo}
                        <Divider />
                        {renderResources}
                    </StyledCard>
                </Grid>
                <Grid container xs={12} md={5} lg={4}>
                    <StyledCard style={{ marginLeft: '0.5rem', height: '100%' }}>
                        <CardHeader title={t('common:discussion')} />
                        <Divider />
                        <DiscussionBox comments={comments} />
                    </StyledCard>
                </Grid>
            </Box>
        );

        return (
            <MainLayout title={fullName} backUrl maxWidth="xl">
                {renderMobileContent}
                {renderDesktopContent}
            </MainLayout>
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
