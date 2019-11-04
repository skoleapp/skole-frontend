import { FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { FormErrorMessage } from '../containers';

interface Props extends FieldProps {
  label: string;
  options: Array<{ label: string; value: string }>;
}

export const SelectFormField: React.FC<Props> = ({ field, form, label, options, ...props }) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <StyledSelectFormField>
      <InputLabel>{label}</InputLabel>
      <Select fullWidth error={!!errorText} {...field} {...props}>
        {options.map((o, i) => (
          <MenuItem key={i} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText component={FormErrorMessage}>{errorText}</FormHelperText>
    </StyledSelectFormField>
  );
};

const StyledSelectFormField = styled.div`
  margin-top: 1rem;

  label,
  .MuiSelect-select {
    text-align: left;
  }

  label {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
`;
