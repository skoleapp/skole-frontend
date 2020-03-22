import {
    Avatar,
    CardContent,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { CloudUploadOutlined, DeleteOutline, SchoolOutlined, ScoreOutlined, SubjectOutlined } from '@material-ui/icons';
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
} from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { DiscussionBox, NotFound, StyledList, StyledTable, TabLayout, TextLink } from '../../components';
import { includeDefaultNamespaces, Router, useTranslation } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, MuiColor, SkoleContext, State } from '../../types';
import { getFullCourseName, useOptions, usePrivatePage } from '../../utils';

interface Props extends I18nProps {
    course?: CourseObjectType;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { renderShareOption, renderReportOption } = useOptions();

    if (course) {
        const { subject, school, user } = course;
        const fullName = getFullCourseName(course);
        const subjectName = R.propOr('-', 'name', subject) as string;
        const schoolName = R.propOr('-', 'name', school) as string;
        const creatorId = R.propOr('', 'id', course.user) as string;
        const courseId = R.propOr('', 'id', course) as string;
        const creatorName = R.propOr('-', 'username', user) as string;
        const points = R.propOr('-', 'points', course);
        const resourceCount = R.propOr('-', 'resourceCount', course);
        const resources = R.propOr([], 'resources', course) as ResourceObjectType[];
        const comments = R.propOr([], 'comments', course) as CommentObjectType[];
        const isOwnProfile = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));

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

        const renderResources = resources.length ? (
            <StyledTable disableBoxShadow>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t('common:title')}
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
                        {resources.map((r: ResourceObjectType, i: number) => (
                            <TableRow key={i} onClick={(): Promise<boolean> => Router.push(`/resources/${r.id}`)}>
                                <TableCell>
                                    <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                {isOwnProfile && (
                    <MenuItem>
                        <ListItemText onClick={handleDeleteCourse}>
                            <DeleteOutline /> {t('course:deleteCourse')}
                        </ListItemText>
                    </MenuItem>
                )}
            </StyledList>
        );

        const renderUploadResourceButton = (color: MuiColor): JSX.Element => (
            <Link href={{ pathname: '/upload-resource', query: { course: courseId } }}>
                <IconButton color={color}>
                    <CloudUploadOutlined />
                </IconButton>
            </Link>
        );

        const uploadResourceButtonMobile = renderUploadResourceButton('secondary');
        const uploadResourceButtonDesktop = renderUploadResourceButton('primary');

        return (
            <TabLayout
                title={fullName}
                titleSecondary={t('common:discussion')}
                backUrl
                renderInfo={renderInfo}
                renderOptions={renderOptions}
                tabLabelLeft={t('common:resources')}
                renderLeftContent={renderResources}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                createdInfoProps={createdInfoProps}
                extraActionMobile={uploadResourceButtonMobile}
                extraActionDesktop={uploadResourceButtonDesktop}
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
