import { Button, CircularProgress, FormControl } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormErrorMessage } from '../containers';

interface FormSubmitSectionProps extends FormikProps<any> {
  submitButtonText: string;
}

export const FormSubmitSection: React.FC<FormSubmitSectionProps> = ({
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
    margin: 1rem 0;
  }
`;
