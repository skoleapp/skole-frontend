import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues, RegisterFormValues } from '../../../interfaces';
import { Column } from '../../containers';
import { Button } from '../buttons';
import { LoadingIndicator } from '../LoadingIndicator';
import { FormErrorMessage } from './FormErrorMessage';

interface Props extends FormikProps<LoginFormValues | RegisterFormValues> {
  submitButtonText: string;
}

export const FormSubmitSection: React.ComponentType<Props> = ({
  isSubmitting,
  errors,
  submitButtonText
}) => (
  <Column>
    {isSubmitting ? (
      <LoadingIndicator />
    ) : errors.general ? (
      <ErrorMessage name="general" component={FormErrorMessage} />
    ) : (
      <Button type="submit" disabled={isSubmitting}>
        {submitButtonText}
      </Button>
    )}
  </Column>
);
