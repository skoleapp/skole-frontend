import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { Column } from '../../containers';
import { FormErrorMessage } from '../forms';
import { Label } from '../inputs';

const StyledSelectFormField = styled.div`
  margin-top: 0.75rem;
`;

const StyledSelect = styled.select`
  margin: 0.5rem;
  width: 100%;
  max-width: 18.25rem;
  height: 2.5rem;
  font-size: 1rem;
  border: var(--white-border);
  box-shadow: var(--box-shadow);
`;

export const SelectFormField: React.FC<FormFieldProps> = ({ label, field, children, ...props }) => (
  <StyledSelectFormField>
    <Column>
      <Label>{label}</Label>
      <StyledSelect {...field} {...props}>
        {children}
      </StyledSelect>
      <ErrorMessage name={field.name} component={FormErrorMessage} />
    </Column>
  </StyledSelectFormField>
);
