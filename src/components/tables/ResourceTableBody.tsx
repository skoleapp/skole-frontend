import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
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

  const renderResourceCreator = (resource: ResourceObjectType): JSX.Element | string =>
    resource.user ? (
      <TextLink href={urls.user(resource.user.id)} color="primary">
        {resource.user.username}
      </TextLink>
    ) : (
      t('common:communityUser')
    );

  const renderUserIcon = <AccountCircleOutlined className={clsx(classes.icon, classes.userIcon)} />;
  const renderStarIcon = <StarBorderOutlined className={classes.icon} />;
  const renderDiscussionIcon = <ChatOutlined className={classes.icon} />;
  const renderDownloadsIcon = <CloudDownloadOutlined className={classes.icon} />;

  const renderResourceInfo = (r: ResourceObjectType): JSX.Element => (
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

  const renderResourceType = (r: ResourceObjectType): JSX.Element => (
    <Typography variant="body2" color="textSecondary">
      {R.path(['resourceType', 'name'], r)}
    </Typography>
  );

  const renderResources = resources.map((r, i) => (
    <Link href={urls.resource(r.id)} key={i}>
      <CardActionArea>
        <TableRow>
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
