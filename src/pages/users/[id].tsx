import {
    Avatar,
    Box,
    CardContent,
    Chip,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { EditOutlined, StarBorderOutlined } from '@material-ui/icons';
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
    StyledSwipeableViews,
    StyledTabs,
    TextLink,
} from 'components';
import { useAuthContext, useDeviceContext } from 'context';
import { BadgeObjectType, CourseObjectType, ResourceObjectType, UserDetailDocument, UserObjectType } from 'generated';
import { useFrontendPagination, useMoment, useSwipeableTabs } from 'hooks';
import { includeDefaultNamespaces, useSSRApollo, useTranslation, withAuth, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { breakpoints, breakpointsNum } from 'styles';
import { I18nProps, MaxWidth } from 'types';
import { mediaURL, urls } from 'utils';

interface Props extends I18nProps {
    user?: UserObjectType;
}

const UserPage: NextPage<Props> = ({ user }) => {
    const isMobile = useDeviceContext(breakpointsNum.SM);
    const { t } = useTranslation();
    const moment = useMoment();
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { userMe, verified } = useAuthContext();
    const rank = R.propOr('', 'rank', user) as string;
    const username = R.propOr('-', 'username', user) as string;
    const avatar = R.propOr('', 'avatar', user) as string;
    const title = R.propOr('', 'title', user) as string;
    const bio = R.propOr('', 'bio', user) as string;
    const school = R.propOr('', 'school', userMe);
    const subject = R.propOr('', 'subject', userMe);
    const score = R.propOr('-', 'score', user) as string;
    const joined = moment(R.propOr('', 'created', user)).format('LL');
    const isOwnProfile = R.propOr('', 'id', user) === R.propOr('', 'id', userMe);
    const badges = R.propOr([], 'badges', user) as BadgeObjectType[];
    const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
    const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];
    const courseCount = createdCourses.length;
    const resourceCount = createdResources.length;
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(createdCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(createdResources);

    const profileStrengthSteps = [
        t('profile-strength:step1'),
        t('profile-strength:step2'),
        t('profile-strength:step3'),
    ];

    const getProfileStrength = (): number => {
        let profileStrength = 0;

        if (!!verified) {
            profileStrength++;
        }

        if (!!title && !!bio) {
            profileStrength++;
        }

        if (!!school && !!subject) {
            profileStrength++;
        }

        return profileStrength;
    };

    const getStepCompleted = (i: number): boolean => {
        if (i === 0 && !!verified) {
            return true;
        }

        if (i === 1 && !!title && !!bio) {
            return true;
        }

        if (i === 2 && !!school && !!subject) {
            return true;
        }

        return false;
    };

    const getProfileStrengthText = (): string => {
        switch (getProfileStrength()) {
            case 0: {
                return t('profile-strength:poor');
            }

            case 1: {
                return t('profile-strength:weak');
            }

            case 2: {
                return t('profile-strength:intermediate');
            }

            case 3: {
                return t('profile-strength:strong');
            }

            default: {
                return '-';
            }
        }
    };

    const renderEditProfileButton = isOwnProfile && (
        <ButtonLink
            href={urls.editProfile}
            color="primary"
            variant="outlined"
            endIcon={<EditOutlined />}
            fullWidth={isMobile}
        >
            {t('profile:editProfile')}
        </ButtonLink>
    );

    const renderViewStarredButton = isOwnProfile && (
        <ButtonLink href={urls.starred} color="primary" variant="outlined" endIcon={<StarBorderOutlined />} fullWidth>
            {t('profile:viewStarred')}
        </ButtonLink>
    );

    const renderSettingsButton = isOwnProfile && (
        <Box marginLeft="0.5rem">
            <Tooltip title={t('tooltips:settings')}>
                <SettingsButton color="primary" />
            </Tooltip>
        </Box>
    );

    const renderTitle = !!title && (
        <Typography variant="body2" color="textSecondary">
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
        <Box marginTop="0.5rem">
            <Typography variant="body2" color="textSecondary">
                {t('common:joined')} {joined}
            </Typography>
        </Box>
    );

    const renderAvatarCardContent = (
        <CardContent>
            <Box display="flex" flexDirection="column">
                <Avatar className="main-avatar" src={mediaURL(avatar)} />
                {!isMobile && <Typography variant="body2">{username}</Typography>}
                {!isMobile && renderTitle}
            </Box>
        </CardContent>
    );

    const renderScoreTitle = (
        <Typography variant="body2" color="textSecondary">
            {t('profile:score')}
        </Typography>
    );

    const renderCourseCountTitle = (
        <Typography variant="body2" color="textSecondary">
            {t('profile:courses')}
        </Typography>
    );

    const renderResourceCountTitle = (
        <Typography variant="body2" color="textSecondary">
            {t('profile:resources')}
        </Typography>
    );

    const renderScoreValue = <Typography variant="body2">{score}</Typography>;
    const renderCourseCountValue = <Typography variant="body2">{courseCount}</Typography>;
    const renderResourceCountValue = <Typography variant="body2">{resourceCount}</Typography>;

    const renderRank = !!rank && (
        <Box marginTop="0.5rem">
            <Tooltip title={t('tooltips:rank', { rank })}>
                <Chip size="small" label={rank} />
            </Tooltip>
        </Box>
    );

    const renderBadges = !!badges.length && (
        <Box display="flex" margin="0.25rem -0.25rem -0.25rem -0.25rem">
            {badges.map(({ name, description }, i) => (
                <Box key={i}>
                    <Tooltip title={description || ''}>
                        <Chip className="badge" size="small" label={name} />
                    </Tooltip>
                </Box>
            ))}
        </Box>
    );

    const renderVerifyAccountLink = isOwnProfile && verified === false && (
        <Box marginTop="0.5rem">
            <TextLink href={urls.verifyAccount} color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </Box>
    );

    const renderProfileStrength = isOwnProfile && (
        <Box marginTop="0.5rem">
            <Typography variant="body2" color="textSecondary">
                {t('profile-strength:header')}: <strong>{getProfileStrengthText()}</strong>
            </Typography>
            <Stepper alternativeLabel={isMobile}>
                {profileStrengthSteps.map((label, i) => (
                    <Step key={i} completed={getStepCompleted(i)} active={false}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
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
            </Grid>
            <Box marginTop="0.5rem" textAlign="left">
                {renderTitle}
                {renderBio}
                {renderRank}
                {renderBadges}
                {renderVerifyAccountLink}
                {renderProfileStrength}
                {renderJoined}
            </Box>
            <Box marginTop="0.5rem">{renderEditProfileButton}</Box>
            <Box marginTop="0.5rem">{renderViewStarredButton}</Box>
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
                        {renderProfileStrength}
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
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('common:courses')} />
            <Tab label={t('common:resources')} />
        </StyledTabs>
    );

    const renderSwipeableViews = (
        <StyledSwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
            <Box display="flex" flexGrow="1">
                {renderCreatedCourses}
            </Box>
            <Box display="flex" flexGrow="1">
                {renderCreatedResources}
            </Box>
        </StyledSwipeableViews>
    );

    const renderTabsSection = (
        <Box flexGrow="1" display="flex" flexDirection="column" className="border-top">
            {renderTabs}
            {renderSwipeableViews}
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
                        {renderTabsSection}
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

        .main-avatar {
            @media only screen and (max-width: ${breakpoints.SM}) {
                width: 5rem;
                height: 5rem;
            }

            @media only screen and (min-width: ${breakpoints.SM}) {
                margin: 0.5rem;
            }
        }

        #bio {
            overflow: hidden;
            word-break: break-word;
        }

        .badge {
            margin: 0.25rem !important;
        }

        .MuiStepper-root {
            padding: 1.5rem 0 0.5rem 0;
        }
    }
`;

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async ctx => {
    const { apolloClient, initialApolloState } = useSSRApollo(ctx);
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['profile', 'profile-strength']) };

    try {
        const { data } = await apolloClient.query({
            query: UserDetailDocument,
            variables: ctx.query,
        });

        return { props: { ...data, ...nameSpaces, initialApolloState } };
    } catch {
        return { props: { ...nameSpaces, initialApolloState } };
    }
});

export default withAuth(UserPage);
