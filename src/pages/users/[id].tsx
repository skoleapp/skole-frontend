import {
    Avatar,
    Box,
    CardContent,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';

import { CourseObjectType, ResourceObjectType, UserDetailDocument, UserObjectType } from '../../../generated/graphql';
import { ButtonLink, MainLayout, NotFound, SettingsButton, StyledCard, StyledTable, TabPanel } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { getFullCourseName, usePrivatePage, useTabs } from '../../utils';
import { mediaURL } from '../../utils';

interface Props extends I18nProps {
    user?: UserObjectType;
}

const UserPage: I18nPage<Props> = ({ user }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (user) {
        const username = R.propOr('-', 'username', user) as string;
        const email = R.propOr('-', 'email', user) as string;
        const title = R.prop('title', user) as string;
        const avatar = R.prop('avatar', user) as string;
        const bio = R.propOr('-', 'bio', user) as string;
        const points = R.propOr('-', 'points', user);
        const courseCount = R.propOr('-', 'courseCount', user);
        const resourceCount = R.propOr('-', 'resourceCount', user);
        const joined = moment(user.created).format('LL');
        const isOwnProfile = user.id === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
        const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];

        const renderTopSection = (
            <Grid container alignItems="center">
                <Grid item container xs={12} sm={6} justify="center">
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar className="main-avatar" src={mediaURL(avatar)} />
                            <Box marginY="0.5rem">
                                <Typography variant="h1">{username}</Typography>
                            </Box>
                            {!!title && (
                                <Box marginY="0.5rem">
                                    <Typography variant="caption">{title}</Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Grid>
                <Grid item container xs={12} sm={6} direction="column">
                    <Grid container alignItems="center" justify="center">
                        <CardContent>
                            <List>
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
                                            <SchoolOutlined />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText>
                                        {t('common:courses')}: {courseCount}
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
                            </List>
                        </CardContent>
                    </Grid>
                    {isOwnProfile && (
                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <Grid item xs={10} sm={6} md={4}>
                                    <ButtonLink
                                        href="/account/edit-profile"
                                        color="primary"
                                        variant="outlined"
                                        fullWidth
                                    >
                                        {t('profile:editProfileButton')}
                                    </ButtonLink>
                                </Grid>
                                <Grid item xs={2} className="sm-up">
                                    <SettingsButton color="primary" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    )}
                </Grid>
            </Grid>
        );

        const renderAccountInfo = (
            <CardContent>
                <Box textAlign="left">
                    {isOwnProfile && (
                        <Box display="flex" flexDirection="column" marginY="0.5rem">
                            <Typography className="label" variant="body2" color="textSecondary">
                                {t('common:email')}
                            </Typography>
                            <Typography variant="body2">{email}</Typography>
                        </Box>
                    )}
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:joined')} {joined}
                    </Typography>
                </Box>
            </CardContent>
        );

        const renderBioSection = (
            <CardContent>
                <Box textAlign="left">
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:bio')}
                    </Typography>
                    <Typography variant="body2">{bio}</Typography>
                </Box>
            </CardContent>
        );

        const renderTabs = (
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label={t('common:courses')} />
                <Tab label={t('common:resources')} />
            </Tabs>
        );

        const renderTabContent = (
            <>
                <TabPanel value={tabValue} index={0}>
                    {createdCourses.length ? (
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
                                    {createdCourses.map((c: CourseObjectType, i: number) => (
                                        <TableRow
                                            key={i}
                                            onClick={(): Promise<boolean> => Router.push(`/courses/${c.id}`)}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle1">{getFullCourseName(c)}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle1">
                                                    {R.propOr('-', 'points', c)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTable>
                    ) : (
                        <CardContent>
                            <Typography variant="subtitle1">{t('profile:noCourses')}</Typography>
                        </CardContent>
                    )}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {createdResources.length ? (
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
                                    {createdResources.map((r: ResourceObjectType, i: number) => (
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
                            <Typography variant="subtitle1">{t('profile:noResources')}</Typography>
                        </CardContent>
                    )}
                </TabPanel>
            </>
        );

        return (
            <MainLayout heading={username} title={username} backUrl>
                <StyledCard>
                    {renderTopSection}
                    <Divider />
                    {renderAccountInfo}
                    <Divider />
                    {!!bio && renderBioSection}
                    {!!bio && <Divider />}
                    {renderTabs}
                    {renderTabContent}
                </StyledCard>
            </MainLayout>
        );
    } else {
        return <NotFound title={t('profile:notFound')} />;
    }
};

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['profile']) };

    try {
        const { data } = await apolloClient.query({
            query: UserDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withRedux, withApollo)(UserPage);
