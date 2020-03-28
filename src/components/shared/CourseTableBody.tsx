import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';

import { CourseObjectType } from '../../../generated/graphql';

interface Props {
    courses: CourseObjectType[];
}

export const CourseTableBody: React.FC<Props> = ({ courses }) => (
    <StyledCourseTableBody>
        {courses.map((c: CourseObjectType, i: number) => (
            <Link href={`/courses/${c.id}`} key={i}>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle1">{R.propOr('-', 'name', c)}</Typography>
                        {!!c.code && (
                            <Typography id="code" variant="subtitle1" color="textSecondary">
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
    </StyledCourseTableBody>
);

const StyledCourseTableBody = styled(TableBody)`
    #code {
        font-size: 0.75rem;
    }
`;
