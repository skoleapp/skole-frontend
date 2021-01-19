import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import { CourseObjectType } from 'generated';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';
import { TableRowIcon } from './TableRowIcon';

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

  const renderCourseChip = !disableCourseChip && <TableRowChip label={t('common:course')} />;
  const renderCourseCodeChip = <TableRowChip label={code} />;
  const renderUserIcon = <TableRowIcon icon={AccountCircleOutlined} />;
  const renderScoreIcon = <TableRowIcon icon={ThumbsUpDownOutlined} marginLeft />;
  const renderStarIcon = <TableRowIcon icon={StarBorderOutlined} marginLeft />;
  const renderResourceIcon = <TableRowIcon icon={AssignmentOutlined} marginLeft />;
  const renderDiscussionIcon = <TableRowIcon icon={ChatOutlined} marginLeft />;

  const renderCourseName = (
    <Typography color="textSecondary">
      <Grid container alignItems="center">
        <TableRowIcon icon={SchoolOutlined} />
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
