import {
    Avatar,
    Box,
    CardContent,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { CourseObjectType, ResourceObjectType, UserDetailDocument, UserObjectType } from '../../../generated/graphql';
import {
    ButtonLink,
    MainLayout,
    NotFound,
    SettingsButton,
    StyledCard,
    StyledList,
    StyledTable,
    StyledTabs,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { getFullCourseName, useFrontendPagination, usePrivatePage, useTabs } from '../../utils';
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

        const {
            renderTablePagination: renderCreatedCoursesTablePagination,
            paginatedItems: paginatedCourses,
        } = useFrontendPagination(createdCourses);

        const {
            renderTablePagination: renderCreatedResourcesTablePagination,
            paginatedItems: paginatedResources,
        } = useFrontendPagination(createdResources);

        const renderTopSection = (
            <Grid className="border-bottom" container alignItems="center">
                <Grid item container xs={12} sm={6} justify="center">
                    <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar className="main-avatar" src={mediaURL(avatar)} />
                            <Box marginY="0.5rem">
                                <Typography variant="h2">{username}</Typography>
                            </Box>
                            {!!title && (
                                <Box marginY="0.5rem">
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {title}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Grid>
                <Grid item container xs={12} sm={6} direction="column">
                    <Grid container alignItems="center" justify="center">
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
                            </StyledList>
                        </CardContent>
                    </Grid>
                    {isOwnProfile && (
                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <ButtonLink href="/account/edit-profile" color="primary" variant="outlined">
                                    {t('profile:editProfileButton')}
                                </ButtonLink>
                                <Box marginLeft="0.5rem">
                                    <SettingsButton className="md-up" color="primary" />
                                </Box>
                            </Grid>
                        </CardContent>
                    )}
                </Grid>
            </Grid>
        );

        const renderAccountInfo = (
            <CardContent className="border-bottom">
                <Box textAlign="left">
                    {isOwnProfile && (
                        <>
                            <Typography className="section-help-text" variant="body2" color="textSecondary">
                                {t('common:email')}
                            </Typography>
                            <Typography variant="body2">{email}</Typography>
                        </>
                    )}
                    {!!user.bio && (
                        <Box marginTop="0.5rem">
                            <Typography className="section-help-text" variant="body2" color="textSecondary">
                                {t('common:bio')}
                            </Typography>
                            <Typography variant="body2">{bio}</Typography>
                        </Box>
                    )}
                    <Box marginTop="0.5rem">
                        <Typography className="section-help-text" variant="body2" color="textSecondary">
                            {t('common:joined')} {joined}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        );

        const renderCreatedCourses = !!createdCourses.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table stickyHeader>
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
                            {paginatedCourses.map((c: CourseObjectType, i: number) => (
                                <Link href={`/courses/${c.id}`} key={i}>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1">{getFullCourseName(c)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1">{R.propOr('-', 'points', c)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {renderCreatedCoursesTablePagination}
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('profile:noCourses')}</Typography>
            </CardContent>
        );

        const renderCreatedResources = !!createdResources.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
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
                            {paginatedResources.map((r: ResourceObjectType, i: number) => (
                                <Link href={`/resources/${r.id}`} key={i}>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {renderCreatedResourcesTablePagination}
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('profile:noResources')}</Typography>
            </CardContent>
        );

        const renderTabs = (
            <Box flexGrow="1" display="flex" flexDirection="column">
                <StyledTabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={t('common:courses')} />
                    <Tab label={t('common:resources')} />
                </StyledTabs>
                {tabValue === 0 && (
                    <Box display="flex" flexGrow="1">
                        {renderCreatedCourses}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box display="flex" flexGrow="1">
                        {renderCreatedResources}
                    </Box>
                )}
            </Box>
        );

        return (
            <StyledUserPage
                heading={username}
                title={username}
                headerRight={isOwnProfile ? <SettingsButton color="secondary" /> : undefined}
                backUrl
            >
                <StyledCard>
                    {renderTopSection}
                    {renderAccountInfo}
                    {renderTabs}
                </StyledCard>
            </StyledUserPage>
        );
    } else {
        return <NotFound title={t('profile:notFound')} />;
    }
};

const StyledUserPage = styled(MainLayout)`
    .section-help-text {
        font-size: 0.75rem;
    }
`;

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
