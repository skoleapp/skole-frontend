import { Box, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { ResourceObjectType, ResourceTypeObjectType } from 'generated';
import { Link } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { TextColor, TextVariant } from 'types';
import { urls } from 'utils';

interface Props {
    resources: ResourceObjectType[];
    resourceTypes: ResourceTypeObjectType[];
}
const headerProps = {
    variant: 'body2' as TextVariant,
    color: 'textSecondary' as TextColor,
};

interface ResourceObjectTypePairs {
    [key: string]: ResourceObjectType[] | [];
}

export const ResourceTableBody: React.FC<Props> = ({ resources, resourceTypes }) => {
    let filteredByResourceTypes: ResourceObjectTypePairs = resourceTypes.reduce((acc, type) => {
        if (!!type && !!type.name) {
            acc = { ...acc, [type.name]: [] };
        }
        return acc;
    }, {});

    resources.forEach(resource => {
        if (!!resource && !!resource.resourceType && !!filteredByResourceTypes[resource.resourceType]) {
            filteredByResourceTypes = {
                ...filteredByResourceTypes,
                [resource.resourceType]: [...filteredByResourceTypes[resource.resourceType], resource],
            };
        }
    });

    return (
        <TableBody>
            {Object.entries(filteredByResourceTypes).reduce((acc: JSX.Element[], currentValue) => {
                const resourceArray: ResourceObjectType[] = currentValue[1];
                const resourceType: string = currentValue[0];

                const renderResources =
                    !!resourceArray.length &&
                    resourceArray.map((r: ResourceObjectType, i: number) => (
                        <Link href={urls.resource} as={`/resources/${r.id}`} key={i}>
                            <TableRow>
                                <TableCell>
                                    <Box paddingLeft="1rem">
                                        <Typography variant="body2">{R.propOr('-', 'title', r)}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {R.propOr('-', 'date', r)}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Box paddingLeft="1rem">
                                        <Typography variant="body2">{R.propOr('-', 'score', r)}</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </Link>
                    ));
                if (!!renderResources) {
                    const renderRowWithHeader = (
                        <React.Fragment key={resourceType}>
                            <TableRow hover={false}>
                                <TableCell>
                                    <Box paddingLeft="0.5rem">
                                        <Typography {...headerProps}>{resourceType}</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            {renderResources}
                        </React.Fragment>
                    );
                    acc.push(renderRowWithHeader);
                }

                return acc;
            }, [])}
        </TableBody>
    );
};
