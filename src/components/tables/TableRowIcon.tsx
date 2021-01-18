import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginRight: spacing(0.5),
    width: '1rem',
    height: '1rem',
  },
  marginLeft: {
    marginLeft: spacing(2.5),
  },
}));

interface Props {
  icon: typeof SvgIcon;
  marginLeft?: boolean;
}

export const TableRowIcon: React.FC<Props> = ({ icon: Icon, marginLeft }) => {
  const classes = useStyles();
  return <Icon className={clsx(classes.root, marginLeft && classes.marginLeft)} />;
};
