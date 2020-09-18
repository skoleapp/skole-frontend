import { CardActionArea, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { CourseObjectType } from 'generated';
import { Link } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => (
    <TableBody>
        {courses.map((c: CourseObjectType, i: number) => (
            <Link href={urls.course} as={`/courses/${c.id}`} key={i}>
                <CardActionArea>
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
                </CardActionArea>
            </Link>
        ))}
    </TableBody>
);
