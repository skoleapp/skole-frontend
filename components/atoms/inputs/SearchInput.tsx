import React from 'react';
import styled from 'styled-components';
import { TextInput } from '.';
import { FormFieldProps } from '../../../interfaces';

export const StyledSearchInput = styled(TextInput)`
  border-radius: 0.75rem 0 0 0.75rem;
  width: 14rem;
  border: 0.1rem solid var(--primary);
  margin-right: 0.15rem;
`;

export const SearchInput: React.FC<FormFieldProps> = ({ field, ...props }) => (
  <StyledSearchInput {...field} {...props} />
);
