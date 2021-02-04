import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  errorMessage: {
    whiteSpace: 'pre-line', // Break lines at '\n' characters.
    // Use consistent margins with other form helper texts.
    marginLeft: '14px',
    marginRight: '14px',
  },
});

export const FormErrorMessage: React.FC = (props) => {
  const classes = useStyles();
  return <FormHelperText className={classes.errorMessage} error {...props} />;
};
