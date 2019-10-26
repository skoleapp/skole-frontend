import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { FormErrorMessage } from './FormErrorMessage';

export const TextareaFormField: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <StyledTextareaFormField>
    <label>{label}</label>
    <textarea {...field} {...props} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </StyledTextareaFormField>
);

export const StyledTextareaFormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    margin-top: 1rem;
  }

  textarea {
    width: 15rem;
    height: 10rem;
    border: var(--primary-border);
    border-radius: var(--border-radius);
    margin: 2rem 0;
    font-size: 1.05rem;
    padding: 1rem;
    resize: none;
  }
`;
