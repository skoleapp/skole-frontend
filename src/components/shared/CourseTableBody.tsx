import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';

import { CourseObjectType } from '../../../generated/graphql';

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => (
    <TableBody>
        {courses.map((c: CourseObjectType, i: number) => (
            <Link href="/courses/[id]" as={`/courses/${c.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1">{R.propOr('-', 'name', c)}</Typography>
                        {!!c.code && (
                            <Typography className="cell-help-text" variant="subtitle1" color="textSecondary">
                                {R.propOr('-', 'code', c)}
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle1">{R.propOr('-', 'points', c)}</Typography>
                    </TableCell>
                </TableRow>
            </Link>
        ))}
    </TableBody>
);
