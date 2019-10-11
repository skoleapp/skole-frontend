import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { Column } from '../../containers';
import { FormErrorMessage } from '../forms';
import { Label } from './Label';

export const StyledTextarea = styled.textarea`
  width: 15rem;
  border: var(--primary-border);
  border-radius: var(--border-radius);
  margin: 0.5rem;
  height: 5rem;
  font-size: 1.05rem;
  padding: 1rem;
  resize: none;

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
  }
`;

export const Textarea: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <Column>
    <Label>{label}</Label>
    <StyledTextarea {...field} {...props} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </Column>
);
