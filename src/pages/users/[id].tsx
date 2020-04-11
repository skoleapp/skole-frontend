import { Avatar, Box, CardContent, Grid, Tab, Typography } from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import { breakpoints } from 'src/styles';
import styled from 'styled-components';

import { CourseObjectType, ResourceObjectType, UserDetailDocument, UserObjectType } from '../../../generated/graphql';
import {
    ButtonLink,
    CourseTableBody,
    FrontendPaginatedTable,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    SettingsButton,
    StyledCard,
    StyledTabs,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { ButtonColor, ButtonVariant, I18nPage, I18nProps, SkoleContext } from '../../types';
import { useAuth, useFrontendPagination, useTabs, withAuthSync } from '../../utils';
import { mediaURL } from '../../utils';

interface Props extends I18nProps {
    user?: UserObjectType;
}

const UserPage: I18nPage<Props> = ({ user }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();

    if (!!user) {
        const username = R.propOr('-', 'username', user) as string;
        const avatar = R.prop('avatar', user) as string;
        const title = user.title || '';
        const bio = user.bio || '';
        const points = R.propOr('-', 'points', user) as string;
        const courseCount = R.propOr('-', 'courseCount', user) as string;
        const resourceCount = R.propOr('-', 'resourceCount', user) as string;
        const joined = moment(user.created).format('LL');
        const { user: loggedInUser } = useAuth();
        const isOwnProfile = user.id === R.propOr('', 'id', loggedInUser);
        const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
        const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];
        const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(createdCourses);

        const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(
            createdResources,
        );

        const editProfileButtonProps = {
            href: '/account/edit-profile',
            color: 'primary' as ButtonColor,
            variant: 'outlined' as ButtonVariant,
            endIcon: <EditOutlined />,
        };

        const renderTitle = !!title && <Typography variant="subtitle1">{title}</Typography>;
        const renderCourseCountValue = <Typography variant="body1">{courseCount}</Typography>;
        const renderResourceCountValue = <Typography variant="body1">{resourceCount}</Typography>;

        const renderBio = !!bio && (
            <Typography id="bio" variant="body2">
                {bio}
            </Typography>
        );

        const renderJoined = (
            <Box marginTop="0.5rem">
                <Typography className="section-help-text" variant="body2" color="textSecondary">
                    {t('common:joined')} {joined}
                </Typography>
            </Box>
        );

        const renderAvatarCardContent = (
            <CardContent>
                <Box display="flex" flexDirection="column">
                    <Avatar className="main-avatar" src={mediaURL(avatar)} />
                    <Box className="sm-up" marginY="0.5rem">
                        <Typography variant="subtitle1">{username}</Typography>
                    </Box>
                </Box>
            </CardContent>
        );

        const renderPointsValue = <Typography variant="body1">{points}</Typography>;

        const renderPointsTitle = (
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('profile:points')}
            </Typography>
        );

        const renderCourseCountTitle = (
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('profile:courses')}
            </Typography>
        );

        const renderResourceCountTitle = (
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('profile:resources')}
            </Typography>
        );

        const renderMobileTopSection = (
            <Grid container alignItems="center" className="sm-down">
                <Grid item container xs={4}>
                    {renderAvatarCardContent}
                </Grid>
                <Grid item container xs={8} direction="column">
                    <CardContent>
                        <Box display="flex" justifyContent="space-around">
                            <Box>
                                {renderPointsValue}
                                {renderPointsTitle}
                            </Box>
                            <Box margin="0 1rem">
                                {renderCourseCountValue}
                                {renderCourseCountTitle}
                            </Box>
                            <Box>
                                {renderResourceCountValue}
                                {renderResourceCountTitle}
                            </Box>
                        </Box>
                    </CardContent>
                </Grid>
                <CardContent>
                    <Box textAlign="left">
                        {renderTitle}
                        {renderBio}
                        {renderJoined}
                    </Box>
                </CardContent>
                {isOwnProfile && (
                    <Grid item xs={12}>
                        <CardContent>
                            <ButtonLink {...editProfileButtonProps} fullWidth>
                                {t('profile:editProfile')}
                            </ButtonLink>
                        </CardContent>
                    </Grid>
                )}
            </Grid>
        );

        const renderDesktopTopSection = (
            <Grid container alignItems="center" className="sm-up">
                <Grid item container justify="center" xs={5}>
                    {renderAvatarCardContent}
                </Grid>
                <Grid item container xs={7} direction="column" alignItems="flex-start">
                    {isOwnProfile && (
                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <ButtonLink {...editProfileButtonProps}>{t('profile:editProfile')}</ButtonLink>
                                <Box marginLeft="0.5rem">
                                    <SettingsButton color="primary" />
                                </Box>
                            </Grid>
                        </CardContent>
                    )}
                    <CardContent>
                        <Box display="flex">
                            <Box display="flex" alignItems="center">
                                {renderPointsValue}
                                <Box marginLeft="0.25rem">{renderPointsTitle}</Box>
                            </Box>
                            <Box margin="0 1rem" display="flex" alignItems="center">
                                {renderCourseCountValue}
                                <Box marginLeft="0.25rem">{renderCourseCountTitle}</Box>
                            </Box>
                            <Box display="flex" alignItems="center">
                                {renderResourceCountValue}
                                <Box marginLeft="0.25rem">{renderResourceCountTitle}</Box>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardContent>
                        <Box textAlign="left">
                            {renderTitle}
                            {renderBio}
                            {renderJoined}
                        </Box>
                    </CardContent>
                </Grid>
            </Grid>
        );

        const commonTableHeadProps = {
            titleLeft: 'common:title',
            titleRight: 'common:points',
        };

        const renderCreatedCourses = !!createdCourses.length ? (
            <FrontendPaginatedTable
                tableHeadProps={commonTableHeadProps}
                renderTableBody={<CourseTableBody courses={paginatedCourses} />}
                paginationProps={coursePaginationProps}
            />
        ) : (
            <NotFoundBox text={t('profile:noCourses')} />
        );

        const renderCreatedResources = !!createdResources.length ? (
            <FrontendPaginatedTable
                tableHeadProps={commonTableHeadProps}
                renderTableBody={<ResourceTableBody resources={paginatedResources} />}
                paginationProps={resourcePaginationProps}
            />
        ) : (
            <NotFoundBox text={t('profile:noResources')} />
        );

        const renderTabs = (
            <Box flexGrow="1" display="flex" flexDirection="column" className="border-top">
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
                maxWidth="md"
                dynamicBackUrl
            >
                <StyledCard>
                    {renderMobileTopSection}
                    {renderDesktopTopSection}
                    {renderTabs}
                </StyledCard>
            </StyledUserPage>
        );
    } else {
        return <NotFoundLayout title={t('profile:notFound')} />;
    }
};

const StyledUserPage = styled(MainLayout)`
    .section-help-text {
        font-size: 0.75rem;
    }

    @media only screen and (max-width: ${breakpoints.SM}) {
        .main-avatar {
            width: 4rem;
            height: 4rem;
            margin: 0.5rem;
        }
    }

    #bio {
        overflow: hidden;
        word-break: break-word;
    }
`;

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
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

export default compose(withAuthSync, withRedux, withApollo)(UserPage);
