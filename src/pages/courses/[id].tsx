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
    Table,
    TableContainer,
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
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';

import {
    CommentObjectType,
    CourseDetailDocument,
    CourseObjectType,
    DeleteCourseMutation,
    ResourceObjectType,
    useDeleteCourseMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import {
    CreatorListItem,
    DiscussionBox,
    IconButtonLink,
    NavbarContainer,
    NotFound,
    ResourceTableBody,
    StarButton,
    StyledBottomNavigation,
    StyledList,
    StyledTable,
    TabLayout,
    TextLink,
} from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, MuiColor, SkoleContext, State } from '../../types';
import { useFrontendPagination, useOptions, usePrivatePage, useVotes } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { user } = useSelector((state: State) => state.auth);
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions();

    const getFullCourseName = (course: CourseObjectType): string => {
        const { code, name } = course;

        if (code && name) {
            return `${course.name} ${course.code}`;
        } else {
            return course.name || 'N/A';
        }
    };

    if (course) {
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', course.subject) as string;
        const schoolName = R.propOr('-', 'name', course.school) as string;
        const creatorId = R.propOr('', 'id', course.user) as string;
        const courseId = R.propOr('', 'id', course) as string;
        const initialPoints = R.propOr(0, 'points', course) as number;
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];
        const isOwnCourse = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const initialVote = (R.propOr(null, 'vote', course) as unknown) as VoteObjectType | null;
        const starred = !!course.starred;
        const isOwner = !!user && user.id === creatorId;
        const staticBackUrl = { href: '/search' };

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

        const frontendPaginationProps = {
            items: resources,
            notFoundText: 'course:noResources',
            titleLeft: 'common:title',
            titleLeftDesktop: 'common:resources',
            titleRight: 'common:points',
        };

        const { renderTablePagination, paginatedItems, renderNotFound, renderTableHead } = useFrontendPagination(
            frontendPaginationProps,
        );

        const deleteCourseError = (): void => {
            dispatch(toggleNotification(t('notifications:deleteCourseError')));
        };

        const deleteCourseCompleted = ({ deleteCourse }: DeleteCourseMutation): void => {
            if (!!deleteCourse) {
                if (!!deleteCourse.errors) {
                    deleteCourseError();
                } else {
                    Router.push('/');
                    dispatch(toggleNotification(t('notifications:courseDeleted')));
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

        const renderResources = !!resources.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table>
                        {renderTableHead}
                        <ResourceTableBody resources={paginatedItems} />
                    </Table>
                </TableContainer>
                {renderTablePagination}
            </StyledTable>
        ) : (
            renderNotFound
        );

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

        const optionProps = {
            renderOptions,
            renderOptionsHeader,
            drawerProps,
        };

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

        return (
            <TabLayout
                title={fullName}
                titleSecondary={t('common:discussion')}
                staticBackUrl={staticBackUrl}
                renderInfo={renderInfo}
                optionProps={optionProps}
                tabLabelLeft={t('common:resources')}
                renderLeftContent={renderResources}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                headerActionMobile={uploadResourceButtonMobile}
                headerActionDesktop={uploadResourceButtonDesktop}
                customBottomNavbar={renderCustomBottomNavbar}
                extraDesktopActions={renderExtraDesktopActions}
            />
        );
    } else {
        return <NotFound title={t('course:notFound')} />;
    }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
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

export default compose(withApollo, withRedux)(CourseDetailPage);
