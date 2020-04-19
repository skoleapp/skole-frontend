import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';

import { ResourceObjectType } from '../../../generated/graphql';
import { Link } from '../../i18n';

interface Props {
    resources: ResourceObjectType[];
}

export const ResourceTableBody: React.FC<Props> = ({ resources }) => (
    <TableBody>
        {resources.map((r: ResourceObjectType, i: number) => (
            <Link href="/resources/[id]" as={`/resources/${r.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                        <Typography className="cell-help-text" variant="subtitle1" color="textSecondary">
                            {R.propOr('-', 'date', r)}
                        </Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle1">{R.propOr('-', 'score', r)}</Typography>
                    </TableCell>
                </TableRow>
            </Link>
        ))}
    </TableBody>
);
