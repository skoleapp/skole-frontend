import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';

import { CourseObjectType } from '../../../generated/graphql';
import { getFullCourseName } from '../../utils';

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => (
    <TableBody>
        {courses.map((c: CourseObjectType, i: number) => (
            <Link href={`/courses/${c.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1">{getFullCourseName(c)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="subtitle1">{R.propOr('-', 'points', c)}</Typography>
                    </TableCell>
                </TableRow>
            </Link>
        ))}
    </TableBody>
);
