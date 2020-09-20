import { CardActionArea, makeStyles, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { ResourceObjectType, ResourceTypeObjectType } from 'generated';
import { Link } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

const useStyles = makeStyles(({ spacing }) => ({
    resourceTypeHeader: {
        paddingLeft: spacing(1),
    },
    resource: {
        paddingLeft: spacing(2),
    },
}));

interface Props {
    resources: ResourceObjectType[];
    resourceTypes: ResourceTypeObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resourceTypes, resources }) => {
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

    const renderResources = (id: string): JSX.Element[] =>
        resources
            .filter(({ resourceType }) => R.propOr('', 'id', resourceType) === id)
            .map((r, i) => (
                <Link href={urls.resource} as={`/resources/${r.id}`} key={i}>
                    <CardActionArea>
                        <TableRow className={classes.resource}>
                            <TableCell>
                                <Typography variant="body2">{R.propOr('-', 'title', r)}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {R.propOr('-', 'date', r)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2">{R.propOr('-', 'score', r)}</Typography>
                            </TableCell>
                        </TableRow>
                    </CardActionArea>
                </Link>
            ));

    // Filter out resource types that have no resources.
    return (
        <TableBody>
            {resourceTypes
                .filter(({ id }) => resources.find(({ resourceType }) => R.propOr('', 'id', resourceType) === id))
                .map(({ id, name }) => (
                    <>
                        {renderResourceTypeHeader(name)}
                        {renderResources(id)}
                    </>
                ))}
        </TableBody>
    );
};
