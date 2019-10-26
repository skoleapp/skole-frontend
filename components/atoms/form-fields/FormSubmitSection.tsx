import { Button, FormControl } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { AnyForm } from '../../../interfaces';
import { LoadingIndicator } from '../LoadingIndicator';
import { FormErrorMessage } from './FormErrorMessage';

interface FormSubmitSectionProps extends FormikProps<AnyForm> {
  submitButtonText: string;
}

export const FormSubmitSection: React.ComponentType<FormSubmitSectionProps> = ({
  isSubmitting,
  submitButtonText
}) => (
  <StyledFormSubmitSection fullWidth>
    {isSubmitting ? (
      <LoadingIndicator />
    ) : (
      <ErrorMessage name="general" component={FormErrorMessage} />
    )}
    <Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
      {submitButtonText}
    </Button>
  </StyledFormSubmitSection>
);

const StyledFormSubmitSection = styled(FormControl)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    margin: 1.5rem 0;
  }
`;
