import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import clsx from 'clsx';
import { CourseObjectType } from 'generated';
import { useTranslation } from 'lib';
import Link from 'next/link';
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
  userIcon: {
    marginLeft: 0,
  },
}));

interface Props {
  courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const renderCourseName = (c: CourseObjectType): JSX.Element => (
    <Typography variant="body2">{R.propOr('-', 'name', c)}</Typography>
  );

  const renderCourseCode = (r: CourseObjectType): JSX.Element => (
    <Typography variant="body2" color="textSecondary">
      {R.propOr('', 'code', r)}
    </Typography>
  );

  const renderCourseCreator = (course: CourseObjectType): JSX.Element | string =>
    course.user ? (
      <TextLink href={urls.user(course.user.id)} color="primary">
        {course.user.username}
      </TextLink>
    ) : (
      t('common:communityUser')
    );

  const renderUserIcon = <AccountCircleOutlined className={clsx(classes.icon, classes.userIcon)} />;

  const renderStarIcon = <StarBorderOutlined className={classes.icon} />;
  const renderResourceIcon = <AssignmentOutlined className={classes.icon} />;
  const renderDiscussionIcon = <ChatOutlined className={classes.icon} />;

  const renderCourseInfo = (c: CourseObjectType): JSX.Element => (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {renderUserIcon}
        {renderCourseCreator(c)}
        {renderStarIcon}
        {c.starCount}
        {renderResourceIcon}
        {c.resourceCount}
        {renderDiscussionIcon}
        {c.commentCount}
      </Grid>
    </Typography>
  );

  const renderCourseScore = (course: CourseObjectType): JSX.Element => (
    <Typography variant="body2">{R.propOr('-', 'score', course)}</Typography>
  );

  const renderCourses = courses.map((c, i) => (
    <Link href={urls.course(c.id)} key={i}>
      <CardActionArea>
        <TableRow>
          <TableCell>
            {renderCourseName(c)}
            {renderCourseCode(c)}
            {renderCourseInfo(c)}
          </TableCell>
          <TableCell align="right">{renderCourseScore(c)}</TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  ));

  return <TableBody>{renderCourses}</TableBody>;
};
