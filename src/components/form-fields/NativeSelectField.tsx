import { FormControl, InputLabel, Select, SelectProps as MuiSelectProps } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FieldProps, FormikProps } from 'formik';
import { fieldToSelect } from 'formik-material-ui';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface SelectProps extends FieldProps, Omit<MuiSelectProps, 'value'> {}

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    label: string;
}

// We must use duplicate labels; One for telling the outlined field to leave space for the label and the other once for actually showing the label.
export const NativeSelectField: React.FC<Props & SelectProps> = ({ children, label, ...props }) => (
    <FormControl>
        <InputLabel>{label}</InputLabel>
        <Select {...fieldToSelect(props)} label={label} native>
            {children}
        </Select>
        <ErrorMessage name={props.field.name} component={FormErrorMessage} />
    </FormControl>
);
