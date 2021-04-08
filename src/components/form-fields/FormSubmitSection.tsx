import Button, { ButtonProps } from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ErrorMessage, FormikProps, FormikValues } from 'formik';
import * as R from 'ramda';
import React, { useMemo } from 'react';

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

  const renderLoading = isSubmitting && (
    <FormControl>
      <Grid container justify="center">
        <LoadingBox text={loadingText} />
      </Grid>
    </FormControl>
  );

  const renderGeneralFormError = useMemo(
    () => <ErrorMessage name="general" component={FormErrorMessage} />,
    [],
  );

  const renderSubmitButton = useMemo(
    () => (
      <FormControl>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant={variant || 'contained'}
          endIcon={endIcon || <ArrowForwardOutlined />}
          color="primary"
        >
          {submitButtonText}
        </Button>
      </FormControl>
    ),
    [endIcon, isSubmitting, submitButtonText, variant],
  );

  return (
    <Grid container direction="column">
      {renderLoading}
      {renderGeneralFormError}
      {renderSubmitButton}
    </Grid>
  );
};
