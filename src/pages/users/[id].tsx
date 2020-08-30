import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    makeStyles,
    Step,
    StepLabel,
    Stepper,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { EditOutlined, StarBorderOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
    ButtonLink,
    CourseTableBody,
    ErrorLayout,
    FrontendPaginatedTable,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    ResourceTableBody,
    SettingsButton,
    TextLink,
} from 'components';
import { useAuthContext } from 'context';
import {
    BadgeObjectType,
    CourseObjectType,
    ResourceObjectType,
    ResourceTypeObjectType,
    UserDetailDocument,
    UserDetailQueryResult,
    UserObjectType,
} from 'generated';
import { useDayjs, useFrontendPagination, useSwipeableTabs } from 'hooks';
import { includeDefaultNamespaces, initApolloClient, useTranslation, withAuth } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { AuthProps } from 'types';
import { mediaURL, urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    card: {
        width: '100%',
        [breakpoints.down('md')]: {
            borderRadius: 0,
        },
    },
    contentCard: {
        flexGrow: 1,
        marginTop: spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    avatar: {
        margin: 0,
        marginBottom: spacing(4),
    },
    statsContainer: {
        marginTop: spacing(4),
        marginBottom: spacing(2),
        textAlign: 'center',
    },
    statValue: {
        marginRight: spacing(1),
    },
    stepper: {
        padding: `${spacing(6)} 0`,
    },
    bio: {
        overflow: 'hidden',
        wordBreak: 'break-word',
    },
    badge: {
        margin: spacing(1),
    },
}));

const UserPage: NextPage<UserDetailQueryResult & AuthProps> = ({ data, error, authLoading, authNetworkError }) => {
    const { spacing } = useTheme();
    const classes = useStyles();
    const { isFallback } = useRouter();
    const { breakpoints } = useTheme();
    const isMobile = useMediaQuery(breakpoints.down('sm'));
    const { t } = useTranslation();
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { userMe, verified } = useAuthContext();
    const user: UserObjectType = R.propOr(null, 'user', data);
    const rank = R.propOr('', 'rank', user) as string;
    const username = R.propOr('-', 'username', user) as string;
    const avatar = R.propOr('', 'avatar', user) as string;
    const title = R.propOr('', 'title', user) as string;
    const bio = R.propOr('', 'bio', user) as string;
    const school = R.propOr('', 'school', userMe);
    const subject = R.propOr('', 'subject', userMe);
    const score = R.propOr('-', 'score', user) as string;
    const joined = useDayjs(R.propOr('', 'created', user)).format('LL');
    const isOwnProfile = R.propOr('', 'id', user) === R.propOr('', 'id', userMe);
    const badges = R.propOr([], 'badges', user) as BadgeObjectType[];
    const createdCourses = R.propOr([], 'createdCourses', user) as CourseObjectType[];
    const createdResources = R.propOr([], 'createdResources', user) as ResourceObjectType[];
    const courseCount = createdCourses.length;
    const resourceCount = createdResources.length;

    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(createdCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(createdResources);
    const resourceTypes: ResourceTypeObjectType[] = R.propOr([], 'resourceTypes', data);

    const notFound = t('profile:notFound');
    const seoTitle = !!user ? username : !isFallback ? notFound : '';
    const description = !!user ? t('profile:description', { username }) : notFound;

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

    const renderAvatar = <Avatar className={clsx('main-avatar', classes.avatar)} src={mediaURL(avatar)} />;
    const renderUsername = <Typography variant="body2">{username}</Typography>;

    const renderTitle = !!title && (
        <Typography variant="body2" color="textSecondary">
            {title}
        </Typography>
    );

    const renderEditProfileButton = isOwnProfile && (
        <Box display="flex" marginTop={isMobile ? spacing(2) : 0}>
            <ButtonLink
                href={urls.editProfile}
                color="primary"
                variant="outlined"
                endIcon={<EditOutlined />}
                fullWidth={isMobile}
            >
                {t('profile:editProfile')}
            </ButtonLink>
        </Box>
    );

    const renderViewStarredButton = isOwnProfile && (
        <Box marginTop={isMobile ? spacing(2) : 0}>
            <ButtonLink
                href={urls.starred}
                color="primary"
                variant="outlined"
                endIcon={<StarBorderOutlined />}
                fullWidth
            >
                {t('profile:viewStarred')}
            </ButtonLink>
        </Box>
    );

    const renderSettingsButton = isOwnProfile && (
        <Box marginLeft={spacing(2)}>
            <Tooltip title={t('tooltips:settings')}>
                <SettingsButton color="primary" />
            </Tooltip>
        </Box>
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

    const renderScoreValue = (
        <Typography variant="subtitle2" className={classes.statValue}>
            {score}
        </Typography>
    );

    const renderCourseCountValue = (
        <Typography variant="subtitle2" className={classes.statValue}>
            {courseCount}
        </Typography>
    );

    const renderResourceCountValue = (
        <Typography variant="subtitle2" className={classes.statValue}>
            {resourceCount}
        </Typography>
    );

    const renderBio = !!bio && (
        <Box marginTop={spacing(1)}>
            <Typography className={classes.bio} variant="body2">
                {bio}
            </Typography>
        </Box>
    );

    const renderJoined = (
        <Box marginTop={spacing(2)}>
            <Typography variant="body2" color="textSecondary">
                {t('common:joined')} {joined}
            </Typography>
        </Box>
    );

    const renderRank = !!rank && (
        <Box marginTop={spacing(2)}>
            <Tooltip title={t('tooltips:rank', { rank })}>
                <Chip size="small" label={rank} />
            </Tooltip>
        </Box>
    );

    const renderBadges = !!badges.length && (
        <Box display="flex" margin={`${spacing(1)} -${spacing(1)} -${spacing(1)} -${spacing(1)}`}>
            {badges.map(({ name, description }, i) => (
                <Box key={i}>
                    <Tooltip title={description || ''}>
                        <Chip className={classes.badge} size="small" label={name} />
                    </Tooltip>
                </Box>
            ))}
        </Box>
    );

    const renderVerifyAccountLink = isOwnProfile && verified === false && (
        <Box marginTop={spacing(2)}>
            <TextLink href={urls.verifyAccount} color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </Box>
    );

    const renderProfileStrength = isOwnProfile && (
        <Box marginTop={spacing(2)}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                {t('profile-strength:header')}: <strong>{getProfileStrengthText()}</strong>
            </Typography>
            <Stepper className={classes.stepper} alternativeLabel={isMobile}>
                {profileStrengthSteps.map((label, i) => (
                    <Step key={i} completed={getStepCompleted(i)} active={false}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );

    const renderActions = !isMobile && (
        <Grid item container>
            {renderEditProfileButton}
            {renderSettingsButton}
        </Grid>
    );

    const renderStats = (
        <Grid container xs={12} sm={8} md={4} spacing={2} className={classes.statsContainer}>
            <Grid item xs={4} container direction={isMobile ? 'column' : 'row'}>
                {renderScoreValue}
                {renderScoreTitle}
            </Grid>
            <Grid item xs={4} container direction={isMobile ? 'column' : 'row'}>
                {renderCourseCountValue}
                {renderCourseCountTitle}
            </Grid>
            <Grid item xs={4} container direction={isMobile ? 'column' : 'row'}>
                {renderResourceCountValue}
                {renderResourceCountTitle}
            </Grid>
        </Grid>
    );

    const renderDesktopInfo = !isMobile && (
        <Grid item container direction="column">
            {renderBio}
            {renderRank}
            {renderBadges}
            {renderVerifyAccountLink}
            {renderProfileStrength}
            {renderJoined}
        </Grid>
    );

    const renderResponsiveInfo = (
        <Grid container>
            <Grid
                item
                xs={4}
                container
                direction="column"
                justify="center"
                alignItems={isMobile ? 'flex-start' : 'center'}
            >
                {renderAvatar}
                {renderUsername}
                {renderTitle}
            </Grid>
            <Grid item xs={8}>
                {renderActions}
                {renderStats}
                {renderDesktopInfo}
            </Grid>
        </Grid>
    );

    const renderMobileInfo = isMobile && (
        <Grid container direction="column">
            {renderBio}
            {renderRank}
            {renderBadges}
            {renderVerifyAccountLink}
            {renderJoined}
        </Grid>
    );

    const renderResponsiveContent = (
        <Card className={classes.card}>
            <CardContent>
                {renderResponsiveInfo}
                {renderMobileInfo}
            </CardContent>
        </Card>
    );

    const renderMobileActionsCard = isMobile && (
        <Card className={clsx(classes.card, classes.contentCard)}>
            <CardContent>
                {renderProfileStrength}
                {renderEditProfileButton}
                {renderViewStarredButton}
            </CardContent>
        </Card>
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
            renderTableBody={<ResourceTableBody resourceTypes={resourceTypes} resources={paginatedResources} />}
            paginationProps={resourcePaginationProps}
        />
    ) : (
        <NotFoundBox text={t('profile:noResources')} />
    );

    const renderTabs = (
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('common:courses')} />
            <Tab label={t('common:resources')} />
        </Tabs>
    );

    const renderSwipeableViews = (
        <Box flexGrow="1" position="relative" minHeight="30rem">
            <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                {renderCreatedCourses}
                {renderCreatedResources}
            </SwipeableViews>
        </Box>
    );

    const renderCreatedContent = (
        <Card className={clsx(classes.card, classes.contentCard)}>
            {renderTabs}
            {renderSwipeableViews}
        </Card>
    );

    const seoProps = {
        title: seoTitle,
        description,
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: username,
            dynamicBackUrl: true,
            headerRight: isOwnProfile && <SettingsButton color="secondary" />,
        },
    };

    if (isFallback || authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    if (!!user) {
        return (
            <MainLayout {...layoutProps}>
                {renderResponsiveContent}
                {renderMobileActionsCard}
                {renderCreatedContent}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const apolloClient = initApolloClient();
    const result = await apolloClient.query({ query: UserDetailDocument, variables: params });

    return {
        props: {
            ...result,
            namespacesRequired: includeDefaultNamespaces(['profile']),
        },
        revalidate: 1,
    };
};

export default withAuth(UserPage);
