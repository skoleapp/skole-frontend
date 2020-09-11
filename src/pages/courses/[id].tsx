import {
    BottomNavigation,
    CardHeader,
    Drawer,
    Grid,
    List,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Paper,
    Tab,
    Tabs,
    Tooltip,
} from '@material-ui/core';
import { CloudUploadOutlined, DeleteOutline } from '@material-ui/icons';
import clsx from 'clsx';
import {
    CustomBottomNavbarContainer,
    ErrorLayout,
    FrontendPaginatedTable,
    IconButtonLink,
    InfoModalContent,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    ResourceTableBody,
    StarButton,
    TextLink,
    TopLevelCommentThread,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import {
    CommentObjectType,
    CourseDetailDocument,
    CourseDetailQueryResult,
    CourseObjectType,
    DeleteCourseMutation,
    ResourceObjectType,
    ResourceTypeObjectType,
    SubjectObjectType,
    useDeleteCourseMutation,
    UserObjectType,
    VoteObjectType,
} from 'generated';
import {
    useActionsDrawer,
    useFrontendPagination,
    useInfoDrawer,
    useMediaQueries,
    useSearch,
    useShare,
    useSwipeableTabs,
    useVotes,
} from 'hooks';
import { includeDefaultNamespaces, initApolloClient, useTranslation, withAuth } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BOTTOM_NAVBAR_HEIGHT } from 'styles';
import { AuthProps } from 'types';
import { redirect, urls } from 'utils';

const useStyles = makeStyles({
    mobileContainer: {
        position: 'absolute',
        width: '100%',
        bottom: BOTTOM_NAVBAR_HEIGHT,
        top: '3rem',
    },
    desktopContainer: {
        flexGrow: 1,
    },
    paperContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
});

const CourseDetailPage: NextPage<CourseDetailQueryResult & AuthProps> = ({
    data,
    error,
    authLoading,
    authNetworkError,
}) => {
    const classes = useStyles();
    const { isFallback } = useRouter();
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
    const { searchUrl } = useSearch();
    const course: CourseObjectType = R.propOr(null, 'course', data);
    const resourceTypes: ResourceTypeObjectType[] = R.propOr(null, 'resourceTypes', data);
    const courseName = R.propOr('', 'name', course) as string;
    const courseCode = R.propOr('', 'code', course) as string;
    const subjects = R.propOr([], 'subjects', course) as SubjectObjectType[];
    const schoolName = R.pathOr('', ['school', 'name'], course) as string;
    const creatorId = R.pathOr('', ['user', 'id'], course) as string;
    const courseId = R.propOr('', 'id', course) as string;
    const schoolId = R.pathOr('', ['school', 'id'], course);
    const initialScore = String(R.propOr(0, 'score', course));
    const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
    const resourceCount = String(resources.length);
    const comments = R.propOr([], 'comments', course) as CommentObjectType[];
    const { commentCount } = useDiscussionContext(comments);
    const initialVote = (R.propOr(null, 'vote', course) as unknown) as VoteObjectType | null;
    const starred = !!R.propOr(undefined, 'starred', course);
    const isOwner = !!userMe && userMe.id === creatorId;
    const courseUser = R.propOr(undefined, 'user', course) as UserObjectType;
    const created = R.propOr(undefined, 'created', course) as string;
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(resources);
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs(comments);
    const { renderShareButton } = useShare({ text: courseName });
    const notFound = t('course:notFound');
    const title = !!course ? courseName : !isFallback ? notFound : '';
    const description = !!course ? t('course:description', { courseName }) : notFound;

    const {
        renderInfoHeader,
        renderInfoButton,
        open: infoOpen,
        anchor: infoAnchor,
        onClose: handleCloseInfo,
    } = useInfoDrawer();

    const {
        renderActionsHeader,
        handleCloseActions,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        open: actionsOpen,
        anchor: actionsAnchor,
    } = useActionsDrawer({ text: courseName });

    const infoDrawerProps = { open: infoOpen, anchor: infoAnchor, onClose: handleCloseInfo };
    const actionsDrawerProps = { open: actionsOpen, anchor: actionsAnchor, onClose: handleCloseActions };

    const upVoteButtonTooltip =
        verificationRequiredTooltip || (isOwner ? t('tooltips:voteOwnCourse') : t('tooltips:upVote'));

    const downVoteButtonTooltip =
        verificationRequiredTooltip || (isOwner ? t('tooltips:voteOwnCourse') : t('tooltips:downVote'));

    const uploadResourceButtonTooltip = verificationRequiredTooltip || t('tooltips:uploadResource');

    const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { course: courseId },
        upVoteButtonTooltip,
        downVoteButtonTooltip,
    });

    const deleteCourseError = (): void => {
        toggleNotification(t('notifications:deleteCourseError'));
    };

    const deleteCourseCompleted = ({ deleteCourse }: DeleteCourseMutation): void => {
        if (!!deleteCourse) {
            if (!!deleteCourse.errors) {
                deleteCourseError();
            } else if (!!deleteCourse.message) {
                toggleNotification(deleteCourse.message);
                redirect(urls.home);
            } else {
                deleteCourseError();
            }
        } else {
            deleteCourseError();
        }
    };

    const [deleteCourse] = useDeleteCourseMutation({
        onCompleted: deleteCourseCompleted,
        onError: deleteCourseError,
    });

    const handleDeleteCourse = async (e: SyntheticEvent): Promise<void> => {
        try {
            await confirm({ title: t('course:deleteCourseTitle'), description: t('course:deleteCourseDescription') });
            deleteCourse({ variables: { id: courseId } });
        } catch {
        } finally {
            handleCloseActions(e);
        }
    };

    const renderSubjectLinks = subjects.map(({ id, name }, i) => (
        <Grid key={i} item xs={12}>
            <TextLink
                href={{
                    ...searchUrl,
                    query: { ...searchUrl.query, subject: Number(id) },
                }}
                color="primary"
            >
                {name}
            </TextLink>
        </Grid>
    ));

    const renderSchoolLink = !!schoolId && (
        <TextLink href={urls.school} as={`/schools/${schoolId}`} color="primary">
            {schoolName}
        </TextLink>
    );

    const infoItems = [
        {
            label: t('common:name'),
            value: courseName,
        },
        {
            label: t('common:courseCode'),
            value: courseCode,
        },
        {
            label: t('common:subjects'),
            value: renderSubjectLinks,
        },
        {
            label: t('common:school'),
            value: renderSchoolLink,
        },
        {
            label: t('common:score'),
            value: score,
        },
        {
            label: t('common:resources'),
            value: resourceCount,
        },
    ];

    const renderStarButton = <StarButton starred={starred} course={courseId} />;

    const commentThreadProps = {
        comments,
        target: { course: Number(courseId) },
        placeholderText: t('course:noComments'),
    };

    const renderDiscussionHeader = (
        <CardHeader
            className="text-left"
            subheader={`${t('common:discussion')} (${commentCount})`}
            action={
                <Grid container>
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                    {renderShareButton}
                    {renderInfoButton}
                    {renderActionsButton}
                </Grid>
            }
        />
    );

    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;

    const renderCustomBottomNavbar = (
        <BottomNavigation>
            <CustomBottomNavbarContainer>
                <Grid container>
                    <Grid item xs={6} container justify="flex-start">
                        {renderStarButton}
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                        {renderUpVoteButton}
                        {renderDownVoteButton}
                    </Grid>
                </Grid>
            </CustomBottomNavbarContainer>
        </BottomNavigation>
    );

    const resourceTableHeadProps = {
        titleLeft: t('common:title'),
        titleLeftDesktop: t('common:resources'),
        titleRight: t('common:score'),
    };

    const renderResources = !!resources.length ? (
        <FrontendPaginatedTable
            tableHeadProps={resourceTableHeadProps}
            renderTableBody={<ResourceTableBody resourceTypes={resourceTypes} resources={paginatedResources} />}
            paginationProps={resourcePaginationProps}
        />
    ) : (
        <NotFoundBox text={t('course:noResources')} />
    );

    const renderUploadResourceButton = (
        <Tooltip title={uploadResourceButtonTooltip}>
            <span>
                <IconButtonLink
                    href={{ pathname: urls.uploadResource, query: { school: schoolId, course: courseId } }}
                    icon={CloudUploadOutlined}
                    disabled={verified === false}
                    color={isMobileOrTablet ? 'secondary' : 'default'}
                    size="small"
                />
            </span>
        </Tooltip>
    );

    const renderResourcesHeader = <CardHeader title={courseName} action={renderUploadResourceButton} />;

    const renderMobileContent = isMobileOrTablet && (
        <Paper className={clsx('paper-container', classes.mobileContainer)}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={`${t('common:resources')} (${resourceCount})`} />
                <Tab label={`${t('common:discussion')} (${commentCount})`} />
            </Tabs>
            <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                {renderResources}
                {renderDiscussion}
            </SwipeableViews>
        </Paper>
    );

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container spacing={2} className={classes.desktopContainer}>
            <Grid item container xs={12} md={7} lg={8}>
                <Paper className={clsx(classes.paperContainer, 'paper-container')}>
                    {renderResourcesHeader}
                    {renderResources}
                </Paper>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <Paper className={clsx(classes.paperContainer, 'paper-container')}>
                    {renderDiscussionHeader}
                    {renderDiscussion}
                </Paper>
            </Grid>
        </Grid>
    );

    const renderInfo = <InfoModalContent user={courseUser} created={created} infoItems={infoItems} />;

    const renderInfoDrawer = (
        <Drawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </Drawer>
    );

    const renderDeleteAction = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemIcon>
                <DeleteOutline />
            </ListItemIcon>
            <ListItemText onClick={handleDeleteCourse}>{t('common:delete')}</ListItemText>
        </MenuItem>
    );

    const renderActions = (
        <List>
            {renderShareAction}
            {renderDeleteAction}
            {renderReportAction}
        </List>
    );

    const renderActionsDrawer = (
        <Drawer {...actionsDrawerProps}>
            {renderActionsHeader}
            {renderActions}
        </Drawer>
    );

    const seoProps = {
        title,
        description,
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            staticBackUrl: { href: searchUrl },
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
            headerLeft: renderUploadResourceButton,
        },
        customBottomNavbar: renderCustomBottomNavbar,
    };

    if (isFallback || authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    if (!!course) {
        return (
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderInfoDrawer}
                {renderActionsDrawer}
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
    const result = await apolloClient.query({ query: CourseDetailDocument, variables: params });

    return {
        props: {
            ...result,
            namespacesRequired: includeDefaultNamespaces(['course']),
        },
        revalidate: 1,
    };
};

export default withAuth(CourseDetailPage);
