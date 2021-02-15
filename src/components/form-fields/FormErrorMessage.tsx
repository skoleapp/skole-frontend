import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles({
  errorMessage: {
    whiteSpace: 'pre-line', // Break lines at '\n' characters.
  },
});

export const FormErrorMessage: React.FC = (props) => {
  const classes = useStyles();
  return <FormHelperText className={clsx(classes.errorMessage, 'form-text')} error {...props} />;
};
