import { ErrorMessage } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { Row } from '../../containers';
import { FormErrorMessage } from '../FormErrorMessage';
import { Label } from './Label';

const StyledCheckbox = styled.input`
  margin: 0.5rem;
`;

export const CheckboxFormField: React.FC<FormFieldProps> = ({ label, field, ...props }) => (
  <>
    <Row>
      <StyledCheckbox type="checkbox" {...field} {...props} />
      <Label>{label}</Label>
    </Row>
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </>
);
