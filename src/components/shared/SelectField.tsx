import { ErrorMessage, FieldAttributes, FieldProps, FormikProps } from 'formik';
import { FormControl, InputLabel, MenuItem, SelectProps as MuiSelectProps, Select } from '@material-ui/core';

import { FormErrorMessage } from './FormErrorMessage';
import React from 'react';
import { fieldToSelect } from 'formik-material-ui';
import styled from 'styled-components';

interface SelectProps extends FieldProps, Omit<MuiSelectProps, 'value'> {}

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    label: string;
}

// FIXME: Label is not working correctly.
export const SelectField: React.FC<Props & SelectProps> = ({ children, label, ...props }) => (
    <StyledFormControl variant="outlined" fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select {...fieldToSelect(props)}>
            <MenuItem value="">---</MenuItem>
            {children}
        </Select>
        <ErrorMessage name={props.field.name} component={FormErrorMessage} />
    </StyledFormControl>
);
const StyledFormControl = styled(FormControl)`
    .MuiFormLabel-root {
        background-color: var(--white);
        border-radius: 0.1rem;
        padding: 0.05rem;
    }
`;
