import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FieldProps, getIn } from 'formik';
import React from 'react';

interface SelectFormFieldProps extends FieldProps {
  label?: string;
  options: Array<{ label: string; value: string }>;
}

export const SelectFormField: React.FC<SelectFormFieldProps> = ({
  field,
  form,
  label,
  options,
  ...props
}) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  return (
    <FormControl fullWidth error={!!errorText}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select fullWidth {...field} {...props}>
        {options.map((o, i) => (
          <MenuItem key={i} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};
