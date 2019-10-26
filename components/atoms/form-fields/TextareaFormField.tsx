import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { FormErrorMessage } from './FormErrorMessage';
import { TextField } from '@material-ui/core';

export const TextareaFormField: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <StyledTextareaFormField>
    <TextField
      label={label}
      margin="normal"
      variant="outlined"
      fullWidth
      multiline
      {...field}
      {...props}
    />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </StyledTextareaFormField>
);

export const StyledTextareaFormField = styled.div`
  .MuiInputBase-root {
    resize: none;
    height: 10rem;
    display: flex;
    align-items: start;
    justify-content: start;
  }
`;
