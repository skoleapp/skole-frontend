import { Button, ButtonProps, FormControl, Grid } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ErrorMessage, FormikProps } from 'formik';
import * as R from 'ramda';
import React from 'react';

import { LoadingBox } from '../shared';
import { FormErrorMessage } from './FormErrorMessage';

interface Props extends FormikProps<Record<symbol, unknown>> {
  submitButtonText: string;
}

export const FormSubmitSection: React.FC<
  Props & Pick<ButtonProps, 'variant' | 'endIcon'>
> = ({ isSubmitting, submitButtonText, endIcon, variant, values }) => {
  const loadingText: string = R.propOr(undefined, 'general', values);

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
