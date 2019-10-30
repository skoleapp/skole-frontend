import { Button, CircularProgress, FormControl } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormErrorMessage } from './FormErrorMessage';

interface FormSubmitSectionProps extends FormikProps<any> {
  submitButtonText: string;
}

export const FormSubmitSection: React.ComponentType<FormSubmitSectionProps> = ({
  isSubmitting,
  submitButtonText
}) => (
  <StyledFormSubmitSection fullWidth>
    {isSubmitting ? (
      <CircularProgress color="primary" />
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
