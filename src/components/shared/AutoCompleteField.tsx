import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { FieldAttributes, FormikProps, getIn } from 'formik';
import { DocumentNode } from 'graphql';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useApolloClient } from 'react-apollo';

import { SchoolTypeObjectType } from '../../../generated/graphql';

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    labelKey: string; // Used to access the label on the object.
    dataKey: string; // Used to access the data after a successful query.
    document: DocumentNode;
    disabled?: boolean;
}

export const AutoCompleteField: React.FC<Props & TextFieldProps> = <T extends SchoolTypeObjectType>({
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
    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

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
        !!val ? form.setFieldValue(name, val) : form.setFieldValue(name, null);
    };

    const renderInput = (params: RenderInputParams): JSX.Element => (
        <TextField
            {...params}
            {...props}
            error={showError}
            helperText={showError ? fieldError : helperText}
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <>
                        {loading && <CircularProgress color="primary" size={20} />}
                        {params.InputProps.endAdornment}
                    </>
                ),
            }}
        />
    );

    return (
        <Autocomplete
            open={open}
            onOpen={(): void => setOpen(true)}
            onClose={(): void => setOpen(false)}
            getOptionLabel={(option): string => R.propOr('', labelKey, option)}
            options={options}
            loading={loading}
            value={value}
            onChange={handleAutoCompleteChange}
            renderInput={renderInput}
            disabled={disabled !== undefined ? disabled : isSubmitting}
        />
    );
};
