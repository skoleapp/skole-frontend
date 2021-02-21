import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ErrorMessage, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import React, { ChangeEvent } from 'react';
import { BORDER_RADIUS } from 'styles';

import { FormErrorMessage } from './FormErrorMessage';

const useStyles = makeStyles(({ palette, spacing }) => ({
  emailInputBox: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: palette.background.default,
    border: `0.05rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
    borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
    padding: spacing(3),
  },
  emailInput: {
    width: '100%',
  },
  emailInputSubmitButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
}));

export const EmailInputFormField = <T extends FormikValues>({
  setFieldValue,
  isSubmitting,
}: FormikProps<T>): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setFieldValue('email', e.target.value);

  return (
    <FormControl margin="none">
      <Grid container>
        <Box className={classes.emailInputBox}>
          <InputBase
            className={classes.emailInput}
            onChange={handleChange}
            placeholder={t('forms:yourEmail')}
            disabled={isSubmitting}
            endAdornment={isSubmitting && <CircularProgress size={20} />}
          />
        </Box>
        <Button
          className={classes.emailInputSubmitButton}
          disabled={isSubmitting}
          type="submit"
          variant="contained"
        >
          <ArrowForwardOutlined />
        </Button>
      </Grid>
      <ErrorMessage name="email" component={FormErrorMessage} />
    </FormControl>
  );
};
