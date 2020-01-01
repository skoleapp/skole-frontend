import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { FieldAttributes, FormikProps, getIn } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { DocumentNode } from 'graphql';
import { SchoolType } from '../../../generated/graphql';
import { useApolloClient } from 'react-apollo';

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    labelKey: string; // Used to access the label on the object.
    dataKey: string; // Used to access the data after a successful query.
    document: DocumentNode;
    disabled?: boolean;
}

export const AutoCompleteField: React.FC<Props & TextFieldProps> = <T extends SchoolType>({
    field,
    form,
    labelKey = 'name',
    dataKey,
    document,
    helperText,
    disabled,
    ...props
}: Props & TextFieldProps) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const apolloClient = useApolloClient();
    const { name, value } = field;
    const { touched, errors, isSubmitting } = form;

    const fetchOptions = async (): Promise<void> => {
        try {
            const { data } = await apolloClient.query({ query: document });
            data[dataKey] && setOptions(data[dataKey]);
        } catch {
            setOptions([]);
        }
    };

    useEffect(() => {
        if (!loading) {
            return undefined;
        }

        fetchOptions();
    }, [loading]);

    useEffect(() => {
        !open && setOptions([]);
    }, [open]);

    const handleAutoCompleteChange = (_e: ChangeEvent<{}>, val: T): void => {
        !!val ? form.setFieldValue(name, val[labelKey as keyof T]) : form.setFieldValue(name, '');
    };

    const renderInput = (params: RenderInputParams): JSX.Element => {
        interface ExtendedRenderInputParams extends RenderInputParams {
            onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        }

        const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
            form.setFieldValue(field.name, e.target.value);
            (params.inputProps as ExtendedRenderInputParams).onChange(e);
        };

        const fieldError = getIn(errors, name);
        const showError = getIn(touched, name) && !!fieldError;

        return (
            <TextField
                {...params}
                {...props}
                error={showError}
                helperText={showError ? fieldError : helperText}
                variant="outlined"
                InputProps={{
                    ...params.InputProps,
                    onChange,
                    endAdornment: (
                        <>
                            {loading && <CircularProgress color="primary" size={20} />}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }}
                fullWidth
            />
        );
    };

    return (
        <Autocomplete
            open={open}
            onOpen={(): void => setOpen(true)}
            onClose={(): void => setOpen(false)}
            getOptionLabel={(option): string => option[labelKey]}
            options={options}
            loading={loading}
            value={{ [labelKey]: value }}
            onChange={handleAutoCompleteChange}
            renderInput={renderInput}
            disabled={disabled != undefined ? disabled : isSubmitting}
        />
    );
};
