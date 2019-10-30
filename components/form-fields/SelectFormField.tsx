import { FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';
import styled from 'styled-components';

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
      <FormHelperText>{errorText}</FormHelperText>
    </StyledSelectFormField>
  );
};

const StyledSelectFormField = styled.div`
  margin-top: 1rem;

  label {
    text-align: left;
  }
`;
