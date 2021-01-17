import { CardActionArea, Chip, Grid, TableCell, TableRow, Typography } from '@material-ui/core';
import {
  AccountCircleOutlined,
  AssignmentOutlined,
  ChatOutlined,
  CloudDownloadOutlined,
  StarBorderOutlined,
  ThumbsUpDownOutlined,
} from '@material-ui/icons';
import clsx from 'clsx';
import { ResourceObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

interface Props {
  resource: ResourceObjectType;
  hideResourceChip?: boolean;
  hideDateChip?: boolean;
  key: number;
}

export const ResourceTableRow: React.FC<Props> = ({
  resource: { id, title, date, resourceType, user, score, starCount, downloads, commentCount },
  hideResourceChip,
  hideDateChip,
  key,
}) => {
  const { t } = useTranslation();

  const renderResourceChip = !hideResourceChip && (
    <Chip className="table-row-chip" label={t('common:resource')} />
  );

  const renderResourceTypeChip = !!resourceType && (
    <Chip className="table-row-chip" label={resourceType.name} />
  );

  const renderDateChip = !hideDateChip && (
    <Chip className="table-row-chip" label={useDayjs(date).format('LL')} />
  );

  const renderUserIcon = <AccountCircleOutlined className="table-row-icon" />;

  const renderScoreIcon = (
    <ThumbsUpDownOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderStarIcon = (
    <StarBorderOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderDiscussionIcon = (
    <ChatOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderDownloadsIcon = (
    <CloudDownloadOutlined className={clsx('table-row-icon', 'table-row-icon-m-left')} />
  );

  const renderResourceTitle = (
    <Typography color="textSecondary">
      <Grid container alignItems="center">
        <AssignmentOutlined className="table-row-icon" />
        <Typography variant="body2" color="textPrimary">
          {title}
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
            {renderChips}
            {renderResourceInfo}
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  );
};
