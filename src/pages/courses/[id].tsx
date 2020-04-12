import {
    Avatar,
    Box,
    CardContent,
    Grid,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Typography,
} from '@material-ui/core';
import {
    CloudUploadOutlined,
    DeleteOutline,
    HouseOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    ScoreOutlined,
    SubjectOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import * as R from 'ramda';
import React from 'react';

import {
    CommentObjectType,
    CourseDetailDocument,
    CourseObjectType,
    DeleteCourseMutation,
    ResourceObjectType,
    useDeleteCourseMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    CreatorListItem,
    DiscussionBox,
    FrontendPaginatedTable,
    IconButtonLink,
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
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo } from '../../lib';
import { I18nPage, I18nProps, MuiColor, SkoleContext } from '../../types';
import { useFrontendPagination, useNotificationsContext, useOptions, useVotes, withAuthSync } from '../../utils';
import { useAuth } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user } = useAuth();
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions();

    const getFullCourseName = (course: CourseObjectType): string => {
        const { code, name } = course;

        if (code && name) {
            return `${course.name} ${course.code}`;
        } else {
            return course.name || 'N/A';
        }
    };

    if (!!course) {
        const fullCourseName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', course.subject) as string;
        const schoolName = R.propOr('-', 'name', course.school) as string;
        const creatorId = R.propOr('', 'id', course.user) as string;
        const courseId = R.propOr('', 'id', course) as string;
        const initialPoints = R.propOr(0, 'points', course) as number;
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];
        const isOwnCourse = creatorId === R.propOr('', 'id', user);
        const initialVote = (R.propOr(null, 'vote', course) as unknown) as VoteObjectType | null;
        const starred = !!course.starred;
        const isOwner = !!user && user.id === creatorId;
        const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(resources);

        const { points, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
            initialVote,
            initialPoints,
            isOwner,
        });

        const subjectLink = {
            pathname: '/search',
            query: { subjectId: R.propOr('', 'id', course.subject) as boolean[] },
        };

        const discussionBoxProps = {
            comments,
            target: { course: Number(course.id) },
            formKey: 'course',
        };

        const deleteCourseError = (): void => {
            toggleNotification(t('notifications:deleteCourseError'));
        };

        const deleteCourseCompleted = ({ deleteCourse }: DeleteCourseMutation): void => {
            if (!!deleteCourse) {
                if (!!deleteCourse.errors) {
                    deleteCourseError();
                } else {
                    Router.push('/');
                    toggleNotification(t('notifications:courseDeleted'));
                }
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

        const renderUpVoteButton = (
            <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                <KeyboardArrowUpOutlined />
            </IconButton>
        );

        const renderDownVoteButton = (
            <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                <KeyboardArrowDownOutlined />
            </IconButton>
        );

        const renderInfo = (
            <CardContent>
                <StyledList>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SubjectOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:subject')}:{' '}
                                <TextLink href={subjectLink} color="primary">
                                    {subjectName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <HouseOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:school')}:{' '}
                                <TextLink
                                    href="/schools/[id]"
                                    as={`/schools/${R.propOr('-', 'id', course.school)}`}
                                    color="primary"
                                >
                                    {schoolName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <ScoreOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:points')}: {points}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CloudUploadOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:resources')}: {resourceCount}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <CreatorListItem user={course.user} created={course.created} />
                </StyledList>
            </CardContent>
        );

        const resourceTableHeadProps = {
            titleLeft: t('common:title'),
            titleLeftDesktop: t('common:resources'),
            titleRight: t('common:points'),
        };

        const renderResources = !!resources.length ? (
            <FrontendPaginatedTable
                tableHeadProps={resourceTableHeadProps}
                renderTableBody={<ResourceTableBody resources={paginatedResources} />}
                paginationProps={resourcePaginationProps}
            />
        ) : (
            <NotFoundBox text={'course:noResources'} />
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
            <IconButtonLink
                href={{ pathname: '/upload-resource', query: { course: courseId } }}
                color={color}
                icon={CloudUploadOutlined}
            />
        );

        const uploadResourceButtonMobile = renderUploadResourceButton('secondary');
        const uploadResourceButtonDesktop = renderUploadResourceButton('default');

        const starButtonProps = {
            starred,
            course: courseId,
        };

        const renderExtraDesktopActions = (
            <Box display="flex" paddingLeft="0.5rem" paddingBottom="0.5rem">
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
                title: fullCourseName,
                description: t('course:description'),
            },
            topNavbarProps: {
                header: fullCourseName,
                staticBackUrl: { href: '/search' },
            },
            headerDesktop: fullCourseName,
            headerSecondary: t('common:discussion'),
            renderInfo,
            optionProps: {
                renderOptions,
                renderOptionsHeader,
                drawerProps,
            },
            tabLabelLeft: `${t('common:resources')} (${resourceCount})`,
            tabLabelRight: `${t('common:discussion')} (${comments.length})`,
            renderLeftContent: renderResources,
            renderRightContent: renderDiscussionBox,
            headerActionMobile: uploadResourceButtonMobile,
            headerActionDesktop: uploadResourceButtonDesktop,
            customBottomNavbar: renderCustomBottomNavbar,
            extraDesktopActions: renderExtraDesktopActions,
        };

        return <TabLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    const { apolloClient, query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['course']) };

    try {
        const { data } = await apolloClient.query({
            query: CourseDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default withApollo(withAuthSync(CourseDetailPage));
