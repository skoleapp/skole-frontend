import * as R from 'ramda';

import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
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
import { CourseDetailDocument, CourseType, ResourceType } from '../../../generated/graphql';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import {
    MainLayout,
    NotFound,
    StyledCard,
    StyledList,
    StyledTable,
    StyledTabs,
    TabPanel,
    TextLink,
} from '../../components';
import { Router, includeDefaultNamespaces } from '../../i18n';
import { getFullCourseName, useAuthSync, useTabs } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { compose } from 'redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    course?: CourseType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t, i18n } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (course) {
        const { subject, school, creator } = course;
        const fullName = getFullCourseName(course);
        const courseCode = R.propOr('-', 'code', course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorName = R.propOr('-', 'username', creator) as string;
        moment.locale(i18n.language); // Set moment language.
        const created = moment(course.created).format('LL');
        const modified = moment(course.modified).format('LL');
        const points = R.propOr('-', 'points', course);
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceType[];

        const subjectLink = {
            pathname: '/search',
            query: { subjectId: R.propOr('', 'id', subject) as boolean[] },
        };

        const renderCourseInfo = (
            <Grid container alignItems="center">
                <Grid item container xs={12} sm={6} justify="center">
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
                                <TextLink href={`/users/${R.propOr('', 'id', creator)}`} color="primary">
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
                </Grid>
                <Grid item container xs={12} sm={6} justify="center">
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
                </Grid>
            </Grid>
        );

        const renderTabs = (
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
        );

        const renderTabContent = (
            <>
                <TabPanel value={tabValue} index={0}>
                    {resources.length ? (
                        <StyledTable disableBoxShadow>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h6">{t('common:title')}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="h6">{t('common:points')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resources.map((r: ResourceType, i: number) => (
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
                    <CardContent>Course discussion will show here...</CardContent>
                </TabPanel>
            </>
        );

        return (
            <MainLayout title={fullName} backUrl>
                <StyledCard>
                    <CardHeader title={fullName} />
                    <Divider />
                    {renderCourseInfo}
                    <Divider />
                    {renderTabs}
                    {renderTabContent}
                </StyledCard>
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
