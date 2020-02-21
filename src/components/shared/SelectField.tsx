import { FormControl, InputLabel, MenuItem, Select, SelectProps as MuiSelectProps } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FieldProps, FormikProps } from 'formik';
import { fieldToSelect } from 'formik-material-ui';
import React from 'react';
import styled from 'styled-components';

import { FormErrorMessage } from './FormErrorMessage';

interface SelectProps extends FieldProps, Omit<MuiSelectProps, 'value'> {}

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    label: string;
}

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
