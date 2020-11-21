import {
  CardActionArea,
  Grid,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import {
  AccountCircleOutlined,
  ChatOutlined,
  CloudDownloadOutlined,
  StarBorderOutlined,
} from '@material-ui/icons';
import clsx from 'clsx';
import { ResourceObjectType } from 'generated';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
  resourceTypeName: {
    paddingRight: spacing(1),
  },
  resource: {
    paddingLeft: spacing(2),
  },
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
  resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const renderResourceTitle = (r: ResourceObjectType): JSX.Element => (
    <Typography variant="body2">{R.propOr('-', 'title', r)}</Typography>
  );

  const renderResourceDate = (r: ResourceObjectType): JSX.Element => {
    const date = useDayjs(R.prop('date', r)).format('LL');
    return (
      <Typography variant="body2" color="textSecondary">
        {date}
      </Typography>
    );
  };

  const renderResourceCreator = (
    resource: ResourceObjectType,
  ): JSX.Element | string =>
    resource.user ? (
      <TextLink href={urls.user(resource.user.id)} color="primary">
        {resource.user.username}
      </TextLink>
    ) : (
      t('common:communityUser')
    );

  const renderUserIcon = (
    <AccountCircleOutlined className={clsx(classes.icon, classes.userIcon)} />
  );

  const renderStarIcon = <StarBorderOutlined className={classes.icon} />;
  const renderDiscussionIcon = <ChatOutlined className={classes.icon} />;

  const renderDownloadsIcon = (
    <CloudDownloadOutlined className={classes.icon} />
  );

  const renderResourceInfo = (r: ResourceObjectType): JSX.Element => {
    return (
      <Typography variant="body2" color="textSecondary">
        <Grid container alignItems="center">
          {renderUserIcon}
          {renderResourceCreator(r)}
          {renderStarIcon}
          {r.starCount}
          {renderDiscussionIcon}
          {r.commentCount}
          {renderDownloadsIcon}
          {r.downloads}
        </Grid>
      </Typography>
    );
  };

  const renderResourceType = (r: ResourceObjectType): JSX.Element => {
    return (
      <Typography
        variant="body2"
        color="textSecondary"
        className={classes.resourceTypeName}
      >
        <Grid container alignItems="center">
          {R.path(['resourceType', 'name'], r)}
        </Grid>
      </Typography>
    );
  };

  const renderResources = resources.map((r, i) => (
    <Link href={urls.resource(r.id)} key={i}>
      <CardActionArea>
        <TableRow className={classes.resource}>
          <TableCell>
            {renderResourceTitle(r)}
            {renderResourceType(r)}
            {renderResourceDate(r)}
            {renderResourceInfo(r)}
          </TableCell>
          <TableCell align="right">
            <Typography variant="body2">{R.propOr('-', 'score', r)}</Typography>
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  ));

  return <TableBody>{renderResources}</TableBody>;
};
