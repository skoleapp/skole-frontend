import { Button, ButtonProps, FormControl, Grid } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ErrorMessage, FormikProps, FormikValues } from 'formik';
import React from 'react';
import * as R from 'ramda';
import { LoadingBox } from '../shared';
import { FormErrorMessage } from './FormErrorMessage';

interface Props<T> extends FormikProps<T> {
  submitButtonText: string;
}

export const FormSubmitSection = <T extends FormikValues>({
  isSubmitting,
  submitButtonText,
  endIcon,
  variant,
  values,
}: Props<T> & Pick<ButtonProps, 'variant' | 'endIcon'>): JSX.Element => {
  const loadingText = R.prop('general', values);

  const renderTextContent = isSubmitting ? (
    <LoadingBox text={loadingText} />
  ) : (
    <ErrorMessage name="general" component={FormErrorMessage} />
  );

  const renderSubmitButton = (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant={variant || 'contained'}
      endIcon={endIcon || <ArrowForwardOutlined />}
      color="primary"
    >
      {submitButtonText}
    </Button>
  );

  return (
    <Grid container direction="column" alignItems="center">
      <FormControl>
        <Grid container justify="center">
          {renderTextContent}
        </Grid>
      </FormControl>
      <FormControl fullWidth>{renderSubmitButton}</FormControl>
    </Grid>
  );
};
