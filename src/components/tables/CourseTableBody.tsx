import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { CourseObjectType } from 'generated';
import { Link } from 'i18n';
import * as R from 'ramda';
import React from 'react';

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => (
    <TableBody>
        {courses.map((c: CourseObjectType, i: number) => (
            <Link href="/courses/[id]" as={`/courses/${c.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        <Typography variant="body2">{R.propOr('-', 'name', c)}</Typography>
                        {!!c.code && (
                            <Typography variant="body2" color="textSecondary">
                                {R.propOr('-', 'code', c)}
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell align="right">
                        <Typography variant="body2">{R.propOr('-', 'score', c)}</Typography>
                    </TableCell>
                </TableRow>
            </Link>
        ))}
    </TableBody>
);
