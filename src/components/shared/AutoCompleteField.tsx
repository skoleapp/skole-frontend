import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { FieldAttributes, FormikProps } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { DocumentNode } from 'graphql';
import { SchoolType } from '../../../generated/graphql';
import { useApolloClient } from 'react-apollo';

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    label: string;
    labelKey: string;
    placeholder: string;
    dataKey: string;
    document: DocumentNode;
}

export const AutoCompleteField: React.FC<Props> = <T extends SchoolType>({
    field,
    form,
    label,
    labelKey = 'name',
    placeholder,
    dataKey,
    document,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const apolloClient = useApolloClient();

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
        !!val ? form.setFieldValue(field.name, val[labelKey as keyof T]) : form.setFieldValue(field.name, '');
    };

    const renderInput = (params: RenderInputParams): JSX.Element => {
        interface ExtendedRenderInputParams extends RenderInputParams {
            onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        }

        const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
            form.setFieldValue(field.name, e.target.value);
            (params.inputProps as ExtendedRenderInputParams).onChange(e);
        };

        return (
            <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                fullWidth
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
            value={{ [labelKey]: field.value }}
            onChange={handleAutoCompleteChange}
            renderInput={renderInput}
        />
    );
};
