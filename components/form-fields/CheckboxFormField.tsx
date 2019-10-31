import { Checkbox, InputLabel } from '@material-ui/core';
import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormErrorMessage } from './FormErrorMessage';

interface Props {
  label: string;
  field: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const CheckboxFormField: React.FC<Props> = ({ field, label, ...props }) => (
  <StyledCheckboxFormField>
    <InputLabel>
      {label}
      <Checkbox color="primary" {...field} {...props} />{' '}
    </InputLabel>
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </StyledCheckboxFormField>
);

const StyledCheckboxFormField = styled.div`
  margin-top: 1rem;
`;
