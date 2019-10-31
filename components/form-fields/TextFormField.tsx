import { TextField } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import styled from 'styled-components';

export const TextFormField: React.FC<FieldProps> = ({ field, form, ...props }) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <StyledTextFormField>
      <TextField fullWidth helperText={errorText} error={!!errorText} {...field} {...props} />
    </StyledTextFormField>
  );
};

const StyledTextFormField = styled.div`
  margin: 0.5rem 0 !important;
`;
