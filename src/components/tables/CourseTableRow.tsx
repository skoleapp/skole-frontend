import { CardActionArea, Chip, Grid, TableCell, TableRow, Typography } from '@material-ui/core';
import {
  AccountCircleOutlined,
  AssignmentOutlined,
  ChatOutlined,
  SchoolOutlined,
  StarBorderOutlined,
  ThumbsUpDownOutlined,
} from '@material-ui/icons';
import clsx from 'clsx';
import { CourseObjectType } from 'generated';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { urls } from 'utils';
import { TextLink } from '../shared';

interface Props {
  course: CourseObjectType;
  disableCourseChip?: boolean;
  key: number;
}

export const CourseTableRow: React.FC<Props> = ({
  course: { id, name, code, user, score, starCount, resourceCount, commentCount },
  disableCourseChip,
  key,
}) => {
  const { t } = useTranslation();

  const renderCourseChip = !disableCourseChip && (
    <Chip className="table-row-chip" label={t('common:course')} />
  );

  const renderCourseCodeChip = <Chip className="table-row-chip" label={code} />;
  const renderUserIcon = <AccountCircleOutlined className="table-row-icon" />;

  const renderScoreIcon = (
    <ThumbsUpDownOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderStarIcon = (
    <StarBorderOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderResourceIcon = (
    <AssignmentOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderDiscussionIcon = (
    <ChatOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderCourseName = (
    <Typography color="textSecondary">
      <Grid container alignItems="center">
        <SchoolOutlined className="table-row-icon" />
        <Typography variant="body2" color="textPrimary">
          {name}
        </Typography>
      </Grid>
    </Typography>
  );

  const renderCourseCreator = user ? (
    <TextLink href={urls.user(user.id)} color="primary">
      {user.username}
    </TextLink>
  ) : (
    t('common:communityUser')
  );

  const renderChips = (
    <Grid container>
      {renderCourseChip}
      {renderCourseCodeChip}
    </Grid>
  );

  const renderCourseInfo = (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {renderUserIcon}
        {renderCourseCreator}
        {renderStarIcon}
        {starCount}
        {renderResourceIcon}
        {resourceCount}
        {renderDiscussionIcon}
        {commentCount}
        {renderScoreIcon}
        {score}
      </Grid>
    </Typography>
  );

  return (
    <Link href={urls.course(id)} key={key}>
      <CardActionArea>
        <TableRow>
          <TableCell>
            {renderCourseName}
            {renderChips}
            {renderCourseInfo}
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
