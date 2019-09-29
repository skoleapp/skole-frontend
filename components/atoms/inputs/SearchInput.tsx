import React from 'react';
import styled from 'styled-components';
import { FormFieldProps } from '../../../interfaces';
import { TextInput } from './TextInput';

export const StyledSearchInput = styled(TextInput)`
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  width: 14rem;
  border: var(--primary-border);
  margin-right: 0.15rem;
`;

export const SearchInput: React.FC<FormFieldProps> = ({ field, ...props }) => (
  <StyledSearchInput {...field} {...props} />
);
