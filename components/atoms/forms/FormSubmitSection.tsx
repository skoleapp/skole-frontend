import { Button } from '@material-ui/core';
import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { AnyForm } from '../../../interfaces';
import { Column } from '../../containers';
import { LoadingIndicator } from '../LoadingIndicator';
import { FormErrorMessage } from './FormErrorMessage';

const StyledFormSubmitSection = styled.div`
  margin-top: 0.5rem;
`;

interface Props extends FormikProps<AnyForm> {
  submitButtonText: string;
}

export const FormSubmitSection: React.ComponentType<Props> = ({
  isSubmitting,
  submitButtonText
}) => (
  <StyledFormSubmitSection>
    <Column>
      {isSubmitting ? (
        <LoadingIndicator />
      ) : (
        <ErrorMessage name="general" component={FormErrorMessage} />
      )}
      <Button type="submit" disabled={isSubmitting} variant="contained" color="primary" fullWidth>
        {submitButtonText}
      </Button>
    </Column>
  </StyledFormSubmitSection>
);
