import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { ResourceObjectType } from 'generated';
import { Link } from 'i18n';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

interface Props {
    resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources }) => (
    <TableBody>
        {resources.map((r: ResourceObjectType, i: number) => (
            <Link href={urls.resource} as={`/resources/${r.id}`} key={i}>
                <TableRow>
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
            </Link>
        ))}
    </TableBody>
);
