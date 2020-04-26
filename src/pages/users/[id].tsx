import { Avatar, Box, CardContent, Grid, Tab, Tooltip, Typography } from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useAuthContext, useDeviceContext } from 'src/context';
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
    TextLink,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApolloSSR } from '../../lib';
import { withAuthSync } from '../../lib';
import { breakpoints, breakpointsNum } from '../../styles';
import { I18nProps, MaxWidth, SkolePageContext } from '../../types';
import { mediaURL, useFrontendPagination, useTabs } from '../../utils';

interface Props extends I18nProps {
    user?: UserObjectType;
}

const UserPage: NextPage<Props> = ({ user }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();
    const { user: loggedInUser } = useAuthContext();
    const verified = R.propOr(false, 'verified', loggedInUser);
    const username = R.propOr('-', 'username', user) as string;
    const avatar = R.propOr('', 'avatar', user) as string;
    const title = R.propOr('', 'title', user) as string;
    const bio = R.propOr('', 'bio', 'user') as string;
    const score = R.propOr('-', 'score', user) as string;
    const courseCount = R.propOr('-', 'courseCount', user) as string;
    const resourceCount = R.propOr('-', 'resourceCount', user) as string;
    const joined = moment(R.propOr('', 'created', user)).format('LL');
    const isOwnProfile = R.propOr('', 'id', user) === R.propOr('', 'id', loggedInUser);
    const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
    const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(createdCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(createdResources);
    const isMobile = useDeviceContext(breakpointsNum.SM);

    const renderEditProfileButton = (
        <ButtonLink
            href="/account/edit-profile"
            color="primary"
            variant="outlined"
            endIcon={<EditOutlined />}
            fullWidth={isMobile}
        >
            {t('profile:editProfile')}
        </ButtonLink>
    );

    const renderVerifyAccountLink = isOwnProfile && !verified && (
        <Box marginTop="0.5rem">
            <TextLink href="/account/verify-account" color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </Box>
    );

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

    const renderUserName = (
        <Box marginY="0.5rem">
            <Typography variant="subtitle1">{username}</Typography>
        </Box>
    );

    const renderAvatarCardContent = (
        <CardContent>
            <Box display="flex" flexDirection="column">
                <Avatar className="main-avatar" src={mediaURL(avatar)} />
                {renderUserName}
            </Box>
        </CardContent>
    );

    const renderScoreValue = <Typography variant="body1">{score}</Typography>;

    const renderScoreTitle = (
        <Typography className="section-help-text" variant="body2" color="textSecondary">
            {t('profile:score')}
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

    const renderMobileTopSection = isMobile && (
        <Grid container alignItems="center">
            <Grid item container xs={4}>
                {renderAvatarCardContent}
            </Grid>
            <Grid item container xs={8} direction="column">
                <CardContent>
                    <Box display="flex" justifyContent="space-around">
                        <Box>
                            {renderScoreValue}
                            {renderScoreTitle}
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
                    {renderVerifyAccountLink}
                </Box>
            </CardContent>
            {isOwnProfile && (
                <Grid item xs={12}>
                    <CardContent>{renderEditProfileButton}</CardContent>
                </Grid>
            )}
        </Grid>
    );

    const renderDesktopTopSection = !isMobile && (
        <Grid container alignItems="center">
            <Grid item container justify="center" xs={5}>
                {renderAvatarCardContent}
            </Grid>
            <Grid item container xs={7} direction="column" alignItems="flex-start">
                {isOwnProfile && (
                    <CardContent>
                        <Grid container alignItems="center" justify="center">
                            {renderEditProfileButton}
                            <Box marginLeft="0.5rem">
                                <Tooltip title={t('profile:settingsTooltip')}>
                                    <SettingsButton color="primary" />
                                </Tooltip>
                            </Box>
                        </Grid>
                    </CardContent>
                )}
                <CardContent>
                    <Box display="flex">
                        <Box display="flex" alignItems="center">
                            {renderScoreValue}
                            <Box marginLeft="0.25rem">{renderScoreTitle}</Box>
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
                        {renderVerifyAccountLink}
                    </Box>
                </CardContent>
            </Grid>
        </Grid>
    );

    const commonTableHeadProps = {
        titleLeft: t('common:title'),
        titleRight: t('common:score'),
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

    const layoutProps = {
        seoProps: {
            title: username,
            description: t('profile:description'),
        },
        topNavbarProps: {
            header: username,
            dynamicBackUrl: true,
            headerRight: isOwnProfile && <SettingsButton color="secondary" />,
        },
        containerProps: {
            maxWidth: 'md' as MaxWidth,
        },
    };

    if (!!user) {
        return (
            <StyledUserPage>
                <MainLayout {...layoutProps}>
                    <StyledCard>
                        {renderMobileTopSection}
                        {renderDesktopTopSection}
                        {renderTabs}
                    </StyledCard>
                </MainLayout>
            </StyledUserPage>
        );
    } else {
        return <NotFoundLayout />;
    }
};

const StyledUserPage = styled(Box)`
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

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { query, apolloClient } = ctx as SkolePageContext;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['profile']) };

    try {
        const { data } = await apolloClient.query({
            query: UserDetailDocument,
            variables: query,
        });

        return { props: { ...data, ...nameSpaces } };
    } catch {
        return { props: { ...nameSpaces } };
    }
});

export default withAuthSync(UserPage);
