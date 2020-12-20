import { AssignmentOutlined, SchoolOutlined } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import { SubjectObjectType } from 'generated';
import {
  CardActionArea,
  Grid,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useSearch } from 'hooks';
import * as R from 'ramda';

interface Props {
  subjects: SubjectObjectType[];
}

const useStyles = makeStyles(({ spacing }) => ({
  icon: {
    marginRight: spacing(0.5),
    marginLeft: spacing(1.5),
    width: '1rem',
    height: '1rem',
  },
  courseIcon: {
    marginLeft: 0,
  },
}));

export const SubjectTableBody: React.FC<Props> = ({ subjects }) => {
  const classes = useStyles();
  const { searchUrl } = useSearch();
  const renderCourseIcon = <SchoolOutlined className={clsx(classes.icon, classes.courseIcon)} />;
  const renderResourceIcon = <AssignmentOutlined className={classes.icon} />;

  const renderSubjects = subjects.map((s: SubjectObjectType, i: number) => (
    <Link
      href={{
        ...searchUrl,
        query: { ...searchUrl.query, subject: s.id },
      }}
      key={i}
    >
      <CardActionArea>
        <TableRow>
          <TableCell>
            <Typography variant="body2">{R.propOr('-', 'name', s)}</Typography>
            <Typography variant="body2" color="textSecondary">
              <Grid container alignItems="center">
                {renderCourseIcon}
                {s.courseCount}
                {renderResourceIcon}
                {s.resourceCount}
              </Grid>
            </Typography>
          </TableCell>
        </TableRow>
      </CardActionArea>
    </Link>
  ));

  return <TableBody>{renderSubjects}</TableBody>;
};
