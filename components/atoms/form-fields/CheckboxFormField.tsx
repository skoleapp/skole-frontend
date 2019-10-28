import { Checkbox } from '@material-ui/core';
import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { FormErrorMessage } from './FormErrorMessage';

export const CheckboxFormField: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <StyledCheckboxFormField>
    <label>
      {label}
      <Checkbox color="primary" {...field} {...props} />{' '}
    </label>
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </StyledCheckboxFormField>
);

const StyledCheckboxFormField = styled.div`
  margin-top: 1rem;
`;
