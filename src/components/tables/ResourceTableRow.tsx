import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import { ResourceObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';
import { TableRowChip } from './TableRowChip';
import { TableRowIcon } from './TableRowIcon';

interface Props {
  resource: ResourceObjectType;
  hideResourceChip?: boolean;
  hideDateChip?: boolean;
  key: number;
}

export const ResourceTableRow: React.FC<Props> = ({
  resource: {
    id,
    title,
    date,
    resourceType,
    user,
    score,
    starCount,
    downloads,
    commentCount,
    course,
  },
  hideResourceChip,
  hideDateChip,
  key,
}) => {
  const { t } = useTranslation();

  const renderResourceChip = !hideResourceChip && <TableRowChip label={t('common:resource')} />;
  const renderResourceTypeChip = !!resourceType && <TableRowChip label={resourceType.name} />;
  const renderDateChip = !hideDateChip && <TableRowChip label={useDayjs(date).format('LL')} />;
  const renderUserIcon = <TableRowIcon icon={AccountCircleOutlined} />;
  const renderScoreIcon = <TableRowIcon icon={ThumbsUpDownOutlined} marginLeft />;
  const renderStarIcon = <TableRowIcon icon={StarBorderOutlined} marginLeft />;
  const renderDiscussionIcon = <TableRowIcon icon={ChatOutlined} marginLeft />;
  const renderDownloadsIcon = <TableRowIcon icon={CloudDownloadOutlined} marginLeft />;
  const courseName = R.propOr('', 'name', course);
  const courseCode = R.propOr('', 'code', course);

  const renderResourceTitle = (
    <Typography color="textSecondary">
      <Grid container alignItems="center">
        <TableRowIcon icon={AssignmentOutlined} />
        <Typography variant="body2" color="textPrimary">
          {title}
        </Typography>
      </Grid>
    </Typography>
  );

  const renderResourceCourse = courseName && (
    <Typography color="textSecondary">
      <Grid container alignItems="center">
        <TableRowIcon icon={SchoolOutlined} />
        <Typography variant="caption" color="textSecondary">
          {`${courseName} - ${courseCode}`}
        </Typography>
      </Grid>
    </Typography>
  );

  const renderResourceCreator = user ? (
    <TextLink href={urls.user(user.id)} color="primary">
      {user.username}
    </TextLink>
  ) : (
    t('common:communityUser')
  );

  const renderChips = (
    <Grid container>
      {renderResourceChip}
      {renderResourceTypeChip}
      {renderDateChip}
    </Grid>
  );

  const renderResourceInfo = (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {renderUserIcon}
        {renderResourceCreator}
        {renderStarIcon}
        {starCount}
        {renderDiscussionIcon}
        {commentCount}
        {renderDownloadsIcon}
        {downloads}
        {renderScoreIcon}
        {score}
      </Grid>
    </Typography>
  );

  return (
    <Link href={urls.resource(id)} key={key}>
      <CardActionArea>
        <TableRow>
          <TableCell>
            {renderResourceTitle}
            {renderResourceCourse}
            {renderChips}
            {renderResourceInfo}
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
