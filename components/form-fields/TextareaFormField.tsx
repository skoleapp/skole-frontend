import { TextField } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import styled from 'styled-components';

export const TextareaFormField: React.FC<FieldProps> = ({ field, form, ...props }) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <StyledTextareaFormField>
      <TextField
        fullWidth
        multiline
        helperText={errorText}
        error={!!errorText}
        {...field}
        {...props}
      />
    </StyledTextareaFormField>
  );
};

export const StyledTextareaFormField = styled.div`
  margin: 1rem 0;

  .MuiInputBase-root {
    resize: none;
    height: 10rem;
    display: flex;
    align-items: start;
    justify-content: start;
  }
`;
