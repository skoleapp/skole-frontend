import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import clsx from 'clsx';
import { SubjectObjectType } from 'generated';
import { useSearch } from 'hooks';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';

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
