import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { LoginFormValues, RegisterFormValues, User } from '../../../interfaces';
import { Button } from '../buttons';
import { LoadingIndicator } from '../LoadingIndicator';
import { FormErrorMessage } from './FormErrorMessage';

const StyledFormSubmitSection = styled.div`
  margin-top: 1rem;
`;

interface Props extends FormikProps<LoginFormValues | RegisterFormValues | User> {
  submitButtonText: string;
}

export const FormSubmitSection: React.ComponentType<Props> = ({
  isSubmitting,
  submitButtonText
}) => (
  <StyledFormSubmitSection>
    {isSubmitting ? (
      <LoadingIndicator />
    ) : (
      <ErrorMessage name="general" component={FormErrorMessage} />
    )}
    <Button type="submit" disabled={isSubmitting}>
      {submitButtonText}
    </Button>
  </StyledFormSubmitSection>
);
