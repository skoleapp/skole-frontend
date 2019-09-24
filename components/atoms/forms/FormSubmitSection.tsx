import { ErrorMessage, FormikProps } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { AnyForm } from '../../../interfaces';
import { Column } from '../../containers';
import { Button } from '../buttons';
import { LoadingIndicator } from '../LoadingIndicator';
import { FormErrorMessage } from './FormErrorMessage';

const StyledFormSubmitSection = styled.div`
  margin-top: 1rem;
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
      <Button type="submit" disabled={isSubmitting}>
        {submitButtonText}
      </Button>
    </Column>
  </StyledFormSubmitSection>
);
