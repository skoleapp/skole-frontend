import {
    BottomNavigation,
    Box,
    CardHeader,
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
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, DeleteOutline } from '@material-ui/icons';
import clsx from 'clsx';
import {
    CustomBottomNavbarContainer,
    ErrorLayout,
    IconButtonLink,
    InfoDialogContent,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    PaginatedTable,
    ResourceTableBody,
    ResponsiveDialog,
    StarButton,
    TextLink,
    TopLevelCommentThread,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import {
    CommentObjectType,
    CourseObjectType,
    CourseQueryVariables,
    DeleteCourseMutation,
    ResourceObjectType,
    ResourceTypeObjectType,
    SubjectObjectType,
    useCourseQuery,
    useDeleteCourseMutation,
    UserObjectType,
    VoteObjectType,
} from 'generated';
import { withUserMe } from 'hocs';
import {
    useActionsDialog,
    useInfoDialog,
    useLanguageHeaderContext,
    useMediaQueries,
    useSearch,
    useShare,
    useSwipeableTabs,
    useVotes,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
import { urls } from 'utils';

const useStyles = makeStyles(({ breakpoints }) => ({
    mobileContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    desktopContainer: {
        flexGrow: 1,
    },
    paperContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
    discussionHeader: {
        textAlign: 'left',
    },
}));

const CourseDetailPage: NextPage = () => {
    const classes = useStyles();
    const { query } = useRouter();
    const { t } = useTranslation();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const variables: CourseQueryVariables = R.pick(['id', 'page', 'pageSize'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useCourseQuery({ variables, context });
    const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
    const { searchUrl } = useSearch();
    const course: CourseObjectType = R.propOr(null, 'course', data);
    const resourceTypes: ResourceTypeObjectType[] = R.propOr([], 'resourceTypes', data);
    const courseName: string = R.propOr('', 'name', course);
    const courseCode: string = R.propOr('', 'code', course);
    const subjects: SubjectObjectType[] = R.propOr([], 'subjects', course);
    const schoolName: string = R.pathOr('', ['school', 'name'], course);
    const creatorId: string = R.pathOr('', ['user', 'id'], course);
    const courseId: string = R.propOr('', 'id', course);
    const schoolId = R.pathOr('', ['school', 'id'], course);
    const initialScore = String(R.propOr(0, 'score', course));
    const resources: ResourceObjectType[] = R.pathOr([], ['resources', 'objects'], data);
    const resourceCount = R.pathOr(0, ['resources', 'count'], data);
    const comments: CommentObjectType[] = R.propOr([], 'comments', course);
    const { commentCount } = useDiscussionContext(comments);
    const initialVote: VoteObjectType = R.propOr(null, 'vote', course);
    const starred = !!R.propOr(undefined, 'starred', course);
    const isOwner = !!userMe && userMe.id === creatorId;
    const courseUser: UserObjectType = R.propOr(undefined, 'user', course);
    const created: string = R.propOr(undefined, 'created', course);
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs(comments);
    const { renderShareButton } = useShare({ text: courseName });
    const { infoDialogOpen, infoDialogHeaderProps, renderInfoButton, handleCloseInfoDialog } = useInfoDialog();
    const uploadResourceButtonTooltip = verificationRequiredTooltip || t('tooltips:uploadResource');

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
    } = useActionsDialog({ text: courseName });

    const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { course: courseId },
    });

    const deleteCourseError = (): void => {
        toggleNotification(t('notifications:deleteCourseError'));
    };

    const deleteCourseCompleted = async ({ deleteCourse }: DeleteCourseMutation): Promise<void> => {
        if (!!deleteCourse) {
            if (!!deleteCourse.errors && !!deleteCourse.errors.length) {
                deleteCourseError();
            } else if (!!deleteCourse.successMessage) {
                toggleNotification(deleteCourse.successMessage);
                await Router.push(urls.home);
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
        context,
    });

    const handleDeleteCourse = async (e: SyntheticEvent): Promise<void> => {
        try {
            await confirm({ title: t('course:deleteCourseTitle'), description: t('course:deleteCourseDescription') });
            await deleteCourse({ variables: { id: courseId } });
        } catch {
        } finally {
            handleCloseActionsDialog(e);
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
        <TextLink href={urls.school(schoolId)} color="primary">
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
        noComments: t('course:noComments'),
    };

    const renderDiscussionHeader = (
        <CardHeader
            className={classes.discussionHeader}
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

    const notFoundLinkProps = {
        href: urls.createCourse,
        text: t('course:noResourcesLink'),
    };

    const renderResourceTableBody = <ResourceTableBody resourceTypes={resourceTypes} resources={resources} />;

    const renderResources = !!resources.length ? (
        <PaginatedTable
            tableHeadProps={resourceTableHeadProps}
            renderTableBody={renderResourceTableBody}
            count={resourceCount}
        />
    ) : (
        <NotFoundBox text={t('course:noResources')} linkProps={notFoundLinkProps} />
    );

    const uploadResourceHref = {
        pathname: urls.uploadResource,
        query: { school: schoolId, course: courseId },
    };

    // Do not render a disabled button at all on mobile.
    const renderUploadResourceButton = (!!verified || isDesktop) && (
        <Tooltip title={uploadResourceButtonTooltip}>
            <Typography component="span">
                <IconButtonLink
                    href={uploadResourceHref}
                    icon={CloudUploadOutlined}
                    disabled={verified === false}
                    color={isMobileOrTablet ? 'secondary' : 'default'}
                    size="small"
                />
            </Typography>
        </Tooltip>
    );

    const renderResourcesHeader = <CardHeader title={courseName} action={renderUploadResourceButton} />;

    const renderMobileContent = isMobileOrTablet && (
        <Paper className={classes.mobileContainer}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={`${t('common:resources')} (${resourceCount})`} />
                <Tab label={`${t('common:discussion')} (${commentCount})`} />
            </Tabs>
            <Box flexGrow="1" position="relative">
                <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                    {renderResources}
                    {renderDiscussion}
                </SwipeableViews>
            </Box>
        </Paper>
    );

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container spacing={2} className={classes.desktopContainer}>
            <Grid item container xs={12} md={7} lg={8}>
                <Paper className={clsx(classes.paperContainer)}>
                    {renderResourcesHeader}
                    {renderResources}
                </Paper>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <Paper className={clsx(classes.paperContainer)}>
                    {renderDiscussionHeader}
                    {renderDiscussion}
                </Paper>
            </Grid>
        </Grid>
    );

    const renderInfoDialogContent = <InfoDialogContent user={courseUser} created={created} infoItems={infoItems} />;

    const renderInfoDialog = (
        <ResponsiveDialog
            open={infoDialogOpen}
            onClose={handleCloseInfoDialog}
            dialogHeaderProps={infoDialogHeaderProps}
        >
            {renderInfoDialogContent}
        </ResponsiveDialog>
    );

    const renderDeleteAction = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemIcon>
                <DeleteOutline />
            </ListItemIcon>
            <ListItemText onClick={handleDeleteCourse}>{t('common:delete')}</ListItemText>
        </MenuItem>
    );

    const renderActionsDialogContent = (
        <List>
            {renderShareAction}
            {renderDeleteAction}
            {renderReportAction}
        </List>
    );

    const renderActionsDialog = (
        <ResponsiveDialog
            open={actionsDialogOpen}
            onClose={handleCloseActionsDialog}
            dialogHeaderProps={actionsDialogHeaderProps}
        >
            {renderActionsDialogContent}
        </ResponsiveDialog>
    );

    const layoutProps = {
        seoProps: {
            title: courseName,
            description: t('course:description', { courseName }),
        },
        topNavbarProps: {
            staticBackUrl: { href: searchUrl },
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
            headerLeft: renderUploadResourceButton,
        },
        customBottomNavbar: renderCustomBottomNavbar,
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    if (!!course) {
        return (
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderInfoDialog}
                {renderActionsDialog}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['course'], locale),
    },
});

export default withUserMe(CourseDetailPage);
