import Chip, { ChipProps } from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    minWidth: '5rem',
    height: '1.25rem',
    margin: spacing(1),
    marginLeft: 0,
    cursor: 'pointer',
  },
}));

export const TableRowChip: React.FC<ChipProps> = (props) => {
  const classes = useStyles();
  return <Chip className={classes.root} {...props} />;
};
