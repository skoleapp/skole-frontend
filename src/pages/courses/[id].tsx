import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    SwipeableDrawer,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, InfoOutlined, SchoolOutlined, ScoreOutlined, SubjectOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React, { useState } from 'react';
import { compose } from 'redux';

import {
    CommentObjectType,
    CourseDetailDocument,
    CourseObjectType,
    ResourceObjectType,
} from '../../../generated/graphql';
import {
    DiscussionBox,
    MainLayout,
    ModalHeader,
    NotFound,
    StyledCard,
    StyledTable,
    TabPanel,
    TextLink,
} from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { getFullCourseName, usePrivatePage, useTabs } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();
    const [courseInfoVisible, setCourseInfoVisible] = useState(false);
    const handleOpenCourseInfo = (): void => setCourseInfoVisible(true);
    const handleCloseCourseInfo = (): void => setCourseInfoVisible(false);

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorId = R.propOr('', 'id', course.user);
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

        const renderCreatedInfo = (
            <Box padding="0.5rem" textAlign="left">
                <Typography variant="body2" color="textSecondary">
                    {t('common:createdBy')}{' '}
                    <TextLink href={`/users/${creatorId}`} color="primary">
                        {creatorName}
                    </TextLink>{' '}
                    {created}
                </Typography>
            </Box>
        );

        const renderCourseInfo = (
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

        const renderMobileContent = (
            <Grid container className="md-down">
                <StyledCard>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={t('common:resources')} />
                        <Tab label={t('common:discussion')} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        {renderResources}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} flexGrow="1" display="flex">
                        <DiscussionBox {...discussionBoxProps} />
                    </TabPanel>
                </StyledCard>
            </Grid>
        );

        const renderDesktopContent = (
            <Grid container className="md-up">
                <Grid item container xs={12} md={7} lg={8}>
                    <StyledCard>
                        <CardHeader title={fullName} />
                        <Divider />
                        {renderCourseInfo}
                        {renderCreatedInfo}
                        <Divider />
                        {renderResources}
                    </StyledCard>
                </Grid>
                <Grid item container xs={12} md={5} lg={4}>
                    <StyledCard marginLeft>
                        <CardHeader title={t('common:discussion')} />
                        <Divider />
                        <DiscussionBox {...discussionBoxProps} />
                    </StyledCard>
                </Grid>
            </Grid>
        );

        const renderCourseInfoButton = (
            <IconButton color="secondary" onClick={handleOpenCourseInfo}>
                <InfoOutlined />
            </IconButton>
        );

        const renderCourseInfoModal = (
            <SwipeableDrawer
                anchor="bottom"
                open={!!courseInfoVisible}
                onOpen={(): void => setCourseInfoVisible(true)}
                onClose={handleCloseCourseInfo}
            >
                <Paper>
                    <ModalHeader onCancel={handleCloseCourseInfo} />
                    <CardHeader title={fullName} />
                    {renderCreatedInfo}
                    <Divider />
                    {renderCourseInfo}
                </Paper>
            </SwipeableDrawer>
        );

        return (
            <MainLayout title={fullName} backUrl headerRight={renderCourseInfoButton}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderCourseInfoModal}
            </MainLayout>
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
