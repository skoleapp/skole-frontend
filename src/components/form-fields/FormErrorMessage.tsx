import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'pre-line', // Break lines at '\n' characters.
  },
});

export const FormErrorMessage: React.FC = (props) => {
  const classes = useStyles();
  return <FormHelperText className={clsx(classes.root, 'form-text')} error {...props} />;
};
