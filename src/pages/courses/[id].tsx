import { Box, Grid, IconButton, ListItemText, MenuItem, Tooltip } from '@material-ui/core';
import {
    CloudUploadOutlined,
    DeleteOutline,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';

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
    DiscussionBox,
    FrontendPaginatedTable,
    IconButtonLink,
    InfoModalContent,
    NavbarContainer,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    StarButton,
    StyledBottomNavigation,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { useAuthContext, useNotificationsContext } from '../../context';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApolloSSR, withAuthSync } from '../../lib';
import { I18nProps, MuiColor, SkolePageContext } from '../../types';
import { useFrontendPagination, useOptions, useVotes } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user } = useAuthContext();
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
    const isOwnCourse = creatorId === R.propOr('', 'id', user);
    const initialVote = (R.propOr(null, 'vote', course) as unknown) as VoteObjectType | null;
    const starred = !!R.propOr(undefined, 'starred', course);
    const isOwner = !!user && user.id === creatorId;
    const subjectId = R.path(['subject', 'id'], course) as boolean[];
    const courseUser = R.propOr(undefined, 'user', course) as UserObjectType;
    const created = R.propOr(undefined, 'created', course) as string;
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions();
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(resources);

    const { score, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
        initialVote,
        initialScore,
        isOwner,
    });

    const subjectLink = {
        pathname: '/search',
        query: { subjectId },
    };

    const discussionBoxProps = {
        comments,
        target: { course: Number(courseId) },
        formKey: 'course',
        placeholderText: t('course:commentsPlaceholder'),
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

    const handleDeleteCourse = (): void => {
        confirm({ title: t('course:deleteCourse'), description: t('course:confirmDesc') }).then(() => {
            deleteCourse({ variables: { id: courseId } });
        });
    };

    const handleVoteClick = (status: number) => (): void => {
        handleVote({ status: status, course: courseId });
    };

    const renderSubjectLink = !!subjectId ? (
        <TextLink href={subjectLink} color="primary">
            {subjectName}
        </TextLink>
    ) : (
        undefined
    );

    const renderSchoolLink = !!schoolId ? (
        <TextLink href="/schools/[id]" as={`/schools/${schoolId}`} color="primary">
            {schoolName}
        </TextLink>
    ) : (
        undefined
    );

    const renderUpVoteButton = (
        <Tooltip title={isOwnCourse ? t('course:ownCourseVoteTooltip') : t('course:upvoteTooltip')}>
            <span>
                <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                    <KeyboardArrowUpOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderDownVoteButton = (
        <Tooltip title={isOwnCourse ? t('course:ownCourseVoteTooltip') : t('course:downvoteTooltip')}>
            <span>
                <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                    <KeyboardArrowDownOutlined />
                </IconButton>
            </span>
        </Tooltip>
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

    const renderInfo = <InfoModalContent user={courseUser} created={created} infoItems={infoItems} />;

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

    const renderDiscussionBox = <DiscussionBox {...discussionBoxProps} />;

    const renderOptions = (
        <StyledList>
            {renderShareOption}
            {renderReportOption}
            {isOwnCourse && (
                <MenuItem>
                    <ListItemText onClick={handleDeleteCourse}>
                        <DeleteOutline /> {t('course:deleteCourse')}
                    </ListItemText>
                </MenuItem>
            )}
        </StyledList>
    );

    const renderUploadResourceButton = (color: MuiColor): JSX.Element => (
        <Tooltip title={t('course:uploadResourceTooltip')}>
            <IconButtonLink
                href={{ pathname: '/upload-resource', query: { course: courseId } }}
                color={color}
                icon={CloudUploadOutlined}
            />
        </Tooltip>
    );

    const uploadResourceButtonMobile = renderUploadResourceButton('secondary');
    const uploadResourceButtonDesktop = renderUploadResourceButton('default');

    const starButtonProps = {
        starred,
        course: courseId,
        starredTooltip: t('course:starredTooltip'),
        unstarredTooltip: t('course:unstarredTooltip'),
    };

    const renderExtraDesktopActions = (
        <Box display="flex">
            <StarButton {...starButtonProps} />
            {renderDownVoteButton}
            {renderUpVoteButton}
        </Box>
    );

    const renderCustomBottomNavbar = (
        <StyledBottomNavigation>
            <NavbarContainer>
                <Grid container>
                    <Grid item xs={6} container justify="flex-start">
                        <StarButton {...starButtonProps} />
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                        {renderUpVoteButton}
                        {renderDownVoteButton}
                    </Grid>
                </Grid>
            </NavbarContainer>
        </StyledBottomNavigation>
    );

    const layoutProps = {
        seoProps: {
            title: courseName,
            description: t('course:description'),
        },
        topNavbarProps: {
            staticBackUrl: { href: '/search' },
        },
        headerDesktop: courseName,
        subheaderDesktop: renderSubjectLink,
        subheaderDesktopSecondary: renderSchoolLink,
        headerSecondary: t('common:discussion'),
        renderInfo,
        infoHeader: t('course:infoHeader'),
        infoTooltip: t('course:infoTooltip'),
        optionProps: {
            renderOptions,
            renderOptionsHeader,
            drawerProps,
            optionsTooltip: t('course:optionsTooltip'),
        },
        tabLabelLeft: `${t('common:resources')} (${resourceCount})`,
        tabLabelRight: `${t('common:discussion')} (${comments.length})`,
        renderLeftContent: renderResources,
        renderRightContent: renderDiscussionBox,
        headerLeftMobile: uploadResourceButtonMobile,
        headerActionDesktop: uploadResourceButtonDesktop,
        customBottomNavbar: renderCustomBottomNavbar,
        extraDesktopActions: renderExtraDesktopActions,
    };

    if (!!course) {
        return <TabLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { apolloClient, query } = ctx as SkolePageContext;
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['course']) };

    try {
        const { data } = await apolloClient.query({
            query: CourseDetailDocument,
            variables: query,
        });

        return { props: { ...data, ...namespaces } };
    } catch {
        return { props: { ...namespaces } };
    }
});

export default withAuthSync(CourseDetailPage);
