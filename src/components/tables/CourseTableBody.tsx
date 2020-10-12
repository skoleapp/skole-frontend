import { CardActionArea, Grid, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { AssignmentOutlined, ChatOutlined } from '@material-ui/icons';
import { CourseObjectType } from 'generated';
import { Link, useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
    icon: {
        marginLeft: spacing(1.5),
        marginRight: spacing(0.5),
        width: '1rem',
        height: '1rem',
    },
}));

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const renderCourseNameAndCode = (course: CourseObjectType): JSX.Element => (
        <>
            <Typography variant="body2">{R.propOr('-', 'name', course)}</Typography>
            {!!course.code && (
                <Typography variant="body2" color="textSecondary">
                    {R.propOr('-', 'code', course)}
                </Typography>
            )}
        </>
    );

    const renderCourseCreator = (course: CourseObjectType): JSX.Element | string =>
        !!course.user ? (
            <TextLink href={urls.user} as={`/users/${course.user.id}`} color="primary">
                {course.user.username}
            </TextLink>
        ) : (
            t('common:communityUser')
        );

    const renderResourceIcon = <AssignmentOutlined className={classes.icon} />;
    const renderDiscussionIcon = <ChatOutlined className={classes.icon} />;

    const renderCourseInfo = (course: CourseObjectType): JSX.Element => (
        <Typography variant="body2" color="textSecondary">
            <Grid container alignItems="center">
                {renderCourseCreator(course)}
                {renderResourceIcon}
                {course.resourceCount}
                {renderDiscussionIcon}
                {course.commentCount}
            </Grid>
        </Typography>
    );

    const renderCourseScore = (course: CourseObjectType): JSX.Element => (
        <Typography variant="body2">{R.propOr('-', 'score', course)}</Typography>
    );

    return (
        <TableBody>
            {courses.map((course, i) => (
                <Link href={urls.course} as={`/courses/${course.id}`} key={i}>
                    <CardActionArea>
                        <TableRow>
                            <TableCell>
                                {renderCourseNameAndCode(course)}
                                {renderCourseInfo(course)}
                            </TableCell>
                            <TableCell align="right">{renderCourseScore(course)}</TableCell>
                        </TableRow>
                    </CardActionArea>
                </Link>
            ))}
        </TableBody>
    );
};
