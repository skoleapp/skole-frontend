import { FormControl, InputLabel, Select, SelectProps as MuiSelectProps } from '@material-ui/core';
import { ErrorMessage, FieldAttributes, FormikProps } from 'formik';
import React from 'react';

import { FormErrorMessage } from './FormErrorMessage';

interface Props {
    field: FieldAttributes<MuiSelectProps>;
    form: FormikProps<{}>;
    label: string;
}

// We must use duplicate labels for the following reason:
// One label for telling the outlined field to leave space for the label and the other once for actually showing the label.
// Ignore: We are not using the `form` prop but be omit it from the rest of the props by destructuring it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NativeSelectField: React.FC<Props> = ({ field, form, label, children, ...props }) => (
    <FormControl>
        <InputLabel>{label}</InputLabel>
        <Select label={label} native {...field} {...props}>
            {children}
        </Select>
        <ErrorMessage name={field.name} component={FormErrorMessage} />
    </FormControl>
);
