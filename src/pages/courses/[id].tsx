import { Box, Grid, ListItemText, MenuItem, Tab, Tooltip, Typography } from '@material-ui/core';
import { CloudUploadOutlined, DeleteOutline } from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
    CommentObjectType,
    CourseDetailDocument,
    CourseObjectType,
    DeleteCourseMutation,
    ResourceObjectType,
    useDeleteCourseMutation,
    UserObjectType,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    DiscussionHeader,
    FrontendPaginatedTable,
    IconButtonLink,
    InfoModalContent,
    MainLayout,
    NavbarContainer,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    StarButton,
    StyledBottomNavigation,
    StyledCard,
    StyledDrawer,
    StyledList,
    StyledTabs,
    TextLink,
    TopLevelCommentThread,
} from '../../components';
import { useAuthContext, useDeviceContext, useDiscussionContext, useNotificationsContext } from '../../context';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { useSSRApollo, withAuthSync, withSSRAuth, withUserAgent } from '../../lib';
import { I18nProps } from '../../types';
import {
    useActionsDrawer,
    useFrontendPagination,
    useInfoDrawer,
    useSearch,
    useShare,
    useTabs,
    useVotes,
} from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user, verified, verificationRequiredTooltip } = useAuthContext();
    const { searchUrl } = useSearch();
    const courseName = R.propOr('', 'name', course) as string;
    const courseCode = R.propOr('', 'code', course) as string;
    const subjectName = R.pathOr('', ['subject', 'name'], course) as string;
    const schoolName = R.pathOr('', ['school', 'name'], course) as string;
    const resourceCount = String(R.propOr('', 'resourceCount', course));
    const creatorId = R.pathOr('', ['user', 'id'], course) as string;
    const courseId = R.propOr('', 'id', course) as string;
    const schoolId = R.pathOr('', ['school', 'id'], course);
    const initialScore = String(R.propOr(0, 'score', course));
    const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
    const comments = R.propOr([], 'comments', course) as CommentObjectType[];
    const { commentCount } = useDiscussionContext(comments);
    const isOwnCourse = creatorId === R.propOr('', 'id', user);
    const initialVote = (R.propOr(null, 'vote', course) as unknown) as VoteObjectType | null;
    const starred = !!R.propOr(undefined, 'starred', course);
    const isOwner = !!user && user.id === creatorId;
    const subjectId = R.path(['subject', 'id'], course) as boolean[];
    const courseUser = R.propOr(undefined, 'user', course) as UserObjectType;
    const created = R.propOr(undefined, 'created', course) as string;
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(resources);
    const { renderInfoHeader, renderInfoButton, ...infoDrawerProps } = useInfoDrawer();
    const { tabValue, handleTabChange } = useTabs();
    const { renderShareButton } = useShare(courseName);

    const {
        renderActionsHeader,
        handleCloseActions,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        ...actionsDrawerProps
    } = useActionsDrawer(courseName);

    const upVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnCourse')
        : t('tooltips:upVote');
    const downVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnCourse')
        : t('tooltips:downVote');

    const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { resource: courseId },
        upVoteButtonTooltip,
        downVoteButtonTooltip,
    });

    const subjectLink = {
        ...searchUrl,
        query: { ...searchUrl.query, subject: Number(subjectId) },
    };

    const deleteCourseError = (): void => {
        toggleNotification(t('notifications:deleteCourseError'));
    };

    const deleteCourseCompleted = ({ deleteCourse }: DeleteCourseMutation): void => {
        if (!!deleteCourse) {
            if (!!deleteCourse.errors) {
                deleteCourseError();
            } else if (!!deleteCourse.message) {
                Router.push('/');
                toggleNotification(deleteCourse.message);
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

    const renderSubjectLink = !!subjectId && (
        <TextLink href={subjectLink} color="primary">
            {subjectName}
        </TextLink>
    );

    const renderSchoolLink = !!schoolId && (
        <TextLink href="/schools/[id]" as={`/schools/${schoolId}`} color="primary">
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
            label: t('common:subject'),
            value: renderSubjectLink,
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

    const discussionHeaderProps = {
        commentCount,
        renderStarButton,
        renderUpVoteButton,
        renderDownVoteButton,
        renderShareButton,
        renderInfoButton,
        renderActionsButton,
    };

    const commentThreadProps = {
        comments,
        target: { course: Number(courseId) },
        formKey: 'course',
        placeholderText: t('course:commentsPlaceholder'),
    };

    const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;
    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;

    const renderCustomBottomNavbar = (
        <StyledBottomNavigation>
            <NavbarContainer>
                <Grid container>
                    <Grid item xs={6} container justify="flex-start">
                        {renderStarButton}
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                        {renderUpVoteButton}
                        {renderDownVoteButton}
                    </Grid>
                </Grid>
            </NavbarContainer>
        </StyledBottomNavigation>
    );

    const resourceTableHeadProps = {
        titleLeft: t('common:title'),
        titleLeftDesktop: t('common:resources'),
        titleRight: t('common:score'),
    };

    const renderResources = !!resources.length ? (
        <FrontendPaginatedTable
            tableHeadProps={resourceTableHeadProps}
            renderTableBody={<ResourceTableBody resources={paginatedResources} />}
            paginationProps={resourcePaginationProps}
        />
    ) : (
        <NotFoundBox text={t('course:noResources')} />
    );

    const renderUploadResourceButton = (
        <Tooltip title={!!verificationRequiredTooltip ? verificationRequiredTooltip : t('tooltips:uploadResource')}>
            <span>
                <IconButtonLink
                    href={{ pathname: '/upload-resource', query: { school: schoolId, course: courseId } }}
                    color={isMobile ? 'secondary' : 'default'}
                    icon={CloudUploadOutlined}
                    disabled={verified === false}
                />
            </span>
        </Tooltip>
    );

    const renderCourseName = (
        <Typography className="truncate" variant="subtitle1">
            {courseName}
        </Typography>
    );

    const renderResourcesHeader = (
        <Box className="custom-header">
            <Grid container justify="space-between">
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    {renderCourseName}
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    {renderUploadResourceButton}
                </Box>
            </Grid>
        </Box>
    );

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`${t('common:resources')} (${resourceCount})`} />
            <Tab label={`${t('common:discussion')} (${commentCount})`} />
        </StyledTabs>
    );

    const renderLeftTab = tabValue === 0 && (
        <Box display="flex" flexGrow="1" position="relative">
            {renderResources}
        </Box>
    );

    const renderRightTab = tabValue === 1 && (
        <Box display="flex" flexGrow="1">
            {renderDiscussion}
        </Box>
    );

    const renderMobileContent = isMobile && (
        <StyledCard>
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderDesktopContent = !isMobile && (
        <Grid className="desktop-content" container>
            <Grid item container md={7} lg={8}>
                <StyledCard>
                    {renderResourcesHeader}
                    <Box position="relative" flexGrow="1" display="flex">
                        {renderResources}
                    </Box>
                </StyledCard>
            </Grid>
            <Grid item container md={5} lg={4}>
                <StyledCard marginLeft>
                    {renderDiscussionHeader}
                    {renderDiscussion}
                </StyledCard>
            </Grid>
        </Grid>
    );

    const renderInfo = <InfoModalContent user={courseUser} created={created} infoItems={infoItems} />;

    const renderInfoDrawer = (
        <StyledDrawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </StyledDrawer>
    );

    const renderDeleteAction = isOwnCourse && (
        <MenuItem disabled={verified === false}>
            <ListItemText onClick={handleDeleteCourse}>
                <DeleteOutline /> {t('common:delete')}
            </ListItemText>
        </MenuItem>
    );

    const renderActions = (
        <StyledList>
            {renderShareAction}
            {renderReportAction}
            {renderDeleteAction}
        </StyledList>
    );

    const renderActionsDrawer = (
        <StyledDrawer {...actionsDrawerProps}>
            {renderActionsHeader}
            {renderActions}
        </StyledDrawer>
    );

    const layoutProps = {
        seoProps: {
            title: courseName,
            description: t('course:description'),
        },
        topNavbarProps: {
            staticBackUrl: { href: searchUrl },
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
            headerLeft: renderUploadResourceButton,
        },
        customBottomNavbar: renderCustomBottomNavbar,
    };

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

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async ctx => {
    const { apolloClient, initialApolloState } = useSSRApollo(ctx);
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['course']) };

    try {
        const { data } = await apolloClient.query({
            query: CourseDetailDocument,
            variables: ctx.query,
        });

        return { props: { ...data, ...namespaces, initialApolloState } };
    } catch {
        return { props: { ...namespaces, initialApolloState } };
    }
});

export default withAuthSync(CourseDetailPage);
