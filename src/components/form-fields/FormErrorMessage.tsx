import { FormHelperText, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  errorMessage: {
    whiteSpace: 'pre-line', // Break lines at '\n' characters.
    // The margin size is taken from `MuiFormHelperText-contained`,
    // so that help texts and error messages get rendered to the same indent level.
    marginLeft: '14px',
    marginRight: '14px',
  },
});

export const FormErrorMessage: React.FC = (props) => {
  const classes = useStyles();
  return <FormHelperText className={classes.errorMessage} error {...props} />;
};
