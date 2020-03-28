import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';

import { ResourceObjectType } from '../../../generated/graphql';

interface Props {
    resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources }) => (
    <TableBody>
        {resources.map((r: ResourceObjectType, i: number) => (
            <Link href={`/resources/${r.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        {console.log(r)}
                        <Typography variant="subtitle1">
                            {R.propOr('-', 'title', r)} - {R.propOr('-', 'date', r)}
                        </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                    </TableCell>
                </TableRow>
            </Link>
        ))}
    </TableBody>
);
