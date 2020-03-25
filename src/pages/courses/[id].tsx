import {
    Avatar,
    Box,
    CardContent,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import {
    CloudUploadOutlined,
    DeleteOutline,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    SchoolOutlined,
    ScoreOutlined,
    StarOutlined,
    SubjectOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import moment from 'moment';
import Link from 'next/link';
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
    DiscussionBox,
    NotFound,
    StyledBottomNavigation,
    StyledList,
    StyledTable,
    TabLayout,
    TextLink,
} from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, MuiColor, SkoleContext, State } from '../../types';
import {
    getFullCourseName,
    useFrontendPagination,
    useOptions,
    usePrivatePage,
    useStarButton,
    useVotes,
} from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const {
        renderShareOption,
        renderReportOption,
        renderOptionsHeader,
        mobileDrawerProps,
        desktopDrawerProps,
        openOptions,
    } = useOptions();

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorId = R.propOr('', 'id', course.user) as string;
        const courseId = R.propOr('', 'id', course) as string;
        const creatorName = R.propOr('-', 'username', user) as string;
        const initialPoints = R.propOr(0, 'points', course) as number;
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];
        const isOwnCourse = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const initialVote = R.propOr(null, 'vote', course) as VoteObjectType | null;
        const { points, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({ initialVote, initialPoints });
        const starButtonProps = useStarButton();

        console.log(course);

        const created = moment(course.created)
            .startOf('day')
            .fromNow();

        const subjectLink = {
            pathname: '/search',
            query: { subjectId: R.propOr('', 'id', subject) as boolean[] },
        };

        const discussionBoxProps = {
            comments,
            target: { course: Number(course.id) },
        };

        const createdInfoProps = { creatorId, creatorName, created };
        const { renderTablePagination, paginatedItems } = useFrontendPagination(resources);

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

        const renderStarButton = (
            <IconButton {...starButtonProps}>
                <StarOutlined />
            </IconButton>
        );

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
                                <SchoolOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:school')}:{' '}
                                <TextLink href={`/schools/${R.propOr('-', 'id', school)}`} color="primary">
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
                </StyledList>
            </CardContent>
        );

        const renderResources = !!resources.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography className="md-down" variant="subtitle2" color="textSecondary">
                                        {t('common:title')}
                                    </Typography>
                                    <Typography className="md-up" variant="subtitle2" color="textSecondary">
                                        {t('common:resources')}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {t('common:points')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedItems.map((r: ResourceObjectType, i: number) => (
                                <Link href={`/resources/${r.id}`} key={i}>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {renderTablePagination}
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('course:noResources')}</Typography>
            </CardContent>
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
            openOptions,
            mobileDrawerProps,
            desktopDrawerProps,
        };

        const renderUploadResourceButton = (color: MuiColor): JSX.Element => (
            <Link href={{ pathname: '/upload-resource', query: { course: courseId } }}>
                <IconButton color={color}>
                    <CloudUploadOutlined />
                </IconButton>
            </Link>
        );

        const uploadResourceButtonMobile = renderUploadResourceButton('secondary');
        const uploadResourceButtonDesktop = renderUploadResourceButton('default');

        const renderExtraDesktopActions = (
            <Box display="flex" paddingLeft="0.5rem" paddingBottom="0.5rem">
                {renderStarButton}
                {renderDownVoteButton}
                {renderUpVoteButton}
            </Box>
        );

        const renderCustomBottomNavbar = (
            <StyledBottomNavigation>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" margin="0 1rem">
                    {renderStarButton}
                    <Box display="flex">
                        <Box marginRight="1rem">{renderUpVoteButton}</Box>
                        {renderDownVoteButton}
                    </Box>
                </Box>
            </StyledBottomNavigation>
        );

        return (
            <TabLayout
                title={fullName}
                titleSecondary={t('common:discussion')}
                backUrl
                renderInfo={renderInfo}
                optionProps={optionProps}
                tabLabelLeft={t('common:resources')}
                renderLeftContent={renderResources}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                createdInfoProps={createdInfoProps}
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
