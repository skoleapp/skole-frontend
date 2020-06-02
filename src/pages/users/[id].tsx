import { Avatar, Box, CardContent, Chip, Grid, Tab, Tooltip, Typography } from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext, useDeviceContext } from 'src/context';
import styled from 'styled-components';

import {
    BadgeObjectType,
    CourseObjectType,
    ResourceObjectType,
    UserDetailDocument,
    UserObjectType,
} from '../../../generated/graphql';
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
import { includeDefaultNamespaces } from '../../i18n';
import { withApolloSSR, withAuthSync } from '../../lib';
import { breakpoints, breakpointsNum } from '../../styles';
import { I18nProps, MaxWidth, SkolePageContext } from '../../types';
import { mediaURL, useFrontendPagination, useMoment, useTabs } from '../../utils';

interface Props extends I18nProps {
    user?: UserObjectType;
}

const UserPage: NextPage<Props> = ({ user }) => {
    const { t } = useTranslation();
    const moment = useMoment();
    const { tabValue, handleTabChange } = useTabs();
    const { user: loggedInUser, verified } = useAuthContext();
    const rank = R.propOr('', 'rank', user) as string;
    const username = R.propOr('-', 'username', user) as string;
    const avatar = R.propOr('', 'avatar', user) as string;
    const title = R.propOr('', 'title', user) as string;
    const bio = R.propOr('', 'bio', user) as string;
    const score = R.propOr('-', 'score', user) as string;
    const courseCount = R.propOr('-', 'courseCount', user) as string;
    const resourceCount = R.propOr('-', 'resourceCount', user) as string;
    const joined = moment(R.propOr('', 'created', user)).format('LL');
    const isOwnProfile = R.propOr('', 'id', user) === R.propOr('', 'id', loggedInUser);
    const badges = R.propOr([], 'badges', user) as BadgeObjectType[];
    const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
    const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(createdCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(createdResources);
    const isMobile = useDeviceContext(breakpointsNum.SM);

    const renderEditProfileButton = isOwnProfile && (
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

    const renderSettingsButton = isOwnProfile && (
        <Box marginLeft="0.5rem">
            <Tooltip title={t('profile:settingsTooltip')}>
                <SettingsButton color="primary" />
            </Tooltip>
        </Box>
    );

    const renderTitle = !!title && (
        <Typography variant="subtitle1" color="textSecondary">
            {title}
        </Typography>
    );

    const renderBio = !!bio && (
        <Box marginTop="0.25rem">
            <Typography id="bio" variant="body2">
                {bio}
            </Typography>
        </Box>
    );

    const renderJoined = (
        <Box marginTop="0.25rem">
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('common:joined')} {joined}
            </Typography>
        </Box>
    );

    const renderAvatarCardContent = (
        <CardContent>
            <Box display="flex" flexDirection="column">
                <Avatar className="main-avatar" src={mediaURL(avatar)} />
                {!isMobile && <Typography variant="subtitle1">{username}</Typography>}
                {!isMobile && renderTitle}
            </Box>
        </CardContent>
    );

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

    const renderScoreValue = <Typography variant="body2">{score}</Typography>;
    const renderCourseCountValue = <Typography variant="body2">{courseCount}</Typography>;
    const renderResourceCountValue = <Typography variant="body2">{resourceCount}</Typography>;

    const renderRank = !!rank && (
        <Box marginTop="0.25rem">
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('profile:rank')}
            </Typography>
            <Tooltip title={t('profile:rankTooltip', { rank })}>
                <Chip size="small" label={rank} />
            </Tooltip>
        </Box>
    );

    const renderBadges = !!badges.length && (
        <Box marginTop="0.25rem">
            <Typography className="section-help-text" variant="body2" color="textSecondary">
                {t('profile:badges')}
            </Typography>
            <Box display="flex" margin="0 -0.25rem -0.25rem -0.25rem">
                {badges.map(({ name, description }, i) => (
                    <Box key={i}>
                        <Tooltip title={description}>
                            <Chip className="badge" size="small" label={name} />
                        </Tooltip>
                    </Box>
                ))}
            </Box>
        </Box>
    );

    const renderVerifyAccountLink = isOwnProfile && verified === false && (
        <Box marginTop="0.25rem">
            <TextLink href="/account/verify-account" color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </Box>
    );

    const renderMobileTopSection = isMobile && (
        <CardContent>
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
                <Box textAlign="left">
                    {renderTitle}
                    {renderBio}
                    {renderRank}
                    {renderBadges}
                    {renderVerifyAccountLink}
                    {renderJoined}
                </Box>
                <Box marginTop="0.25rem" width="100%">
                    {renderEditProfileButton}
                </Box>
            </Grid>
        </CardContent>
    );

    const renderDesktopTopSection = !isMobile && (
        <CardContent>
            <Grid container alignItems="center">
                <Grid item container justify="center" xs={5}>
                    {renderAvatarCardContent}
                </Grid>
                <Grid item container xs={7} direction="column" alignItems="flex-start">
                    <Box display="flex" alignItems="center">
                        {renderEditProfileButton}
                        {renderSettingsButton}
                    </Box>
                    <Box display="flex" marginTop="0.25rem">
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
                    <Box textAlign="left" marginTop="0.25rem">
                        {renderBio}
                        {renderRank}
                        {renderBadges}
                        {renderVerifyAccountLink}
                        {renderJoined}
                    </Box>
                </Grid>
            </Grid>
        </CardContent>
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
    .MuiCardContent-root {
        padding-bottom: 0.5rem !important;

        .section-help-text {
            font-size: 0.75rem;
        }

        .main-avatar {
            margin: 0.5rem;

            @media only screen and (max-width: ${breakpoints.SM}) {
                width: 4rem;
                height: 4rem;
            }
        }

        #bio {
            overflow: hidden;
            word-break: break-word;
        }
    }

    .badge {
        margin: 0.25rem !important;
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
