import { CardActionArea, Grid, makeStyles, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { AccountCircleOutlined, ChatOutlined, CloudDownloadOutlined, StarBorderOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { ResourceObjectType, ResourceTypeObjectType } from 'generated';
import { useTranslation } from 'lib';
import Link from 'next/link';
import * as R from 'ramda';
import React, { Fragment } from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

const useStyles = makeStyles(({ spacing }) => ({
    resourceTypeHeader: {
        paddingLeft: spacing(1),
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
    resourceTypes: ResourceTypeObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resourceTypes, resources }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const renderResourceTypeHeader = (name?: string | null): JSX.Element => (
        <TableRow className={classes.resourceTypeHeader}>
            <TableCell>
                <Typography variant="body2" color="textSecondary">
                    {name}
                </Typography>
            </TableCell>
        </TableRow>
    );

    const renderResourceTitle = (r: ResourceObjectType): JSX.Element => (
        <Typography variant="body2">{R.propOr('-', 'title', r)}</Typography>
    );

    const renderResourceDate = (r: ResourceObjectType): JSX.Element => (
        <Typography variant="body2" color="textSecondary">
            {R.propOr('-', 'date', r)}
        </Typography>
    );

    const renderResourceCreator = (resource: ResourceObjectType): JSX.Element | string =>
        !!resource.user ? (
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

    const renderResources = (id: string): JSX.Element[] =>
        resources
            .filter(({ resourceType }) => R.propOr('', 'id', resourceType) === id)
            .map((r, i) => (
                <Link href={urls.resource(r.id)} key={i}>
                    <CardActionArea>
                        <TableRow className={classes.resource}>
                            <TableCell>
                                {renderResourceTitle(r)}
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

    return (
        <TableBody>
            {resourceTypes
                .filter(({ id }) => resources.find(({ resourceType }) => R.propOr('', 'id', resourceType) === id)) // Filter out resource types that have no resources.
                .map(({ id, name }, i) => (
                    <Fragment key={i}>
                        {renderResourceTypeHeader(name)}
                        {renderResources(id)}
                    </Fragment>
                ))}
        </TableBody>
    );
};
