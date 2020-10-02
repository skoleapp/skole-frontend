import { OperationVariables, useApolloClient } from '@apollo/client';
import { CircularProgress, makeStyles, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { FieldAttributes, FormikProps, getIn } from 'formik';
import { DocumentNode } from 'graphql';
import { useQueryOptions } from 'hooks';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
    endAdornment: {
        marginRight: spacing(3),
    },
}));

interface Props {
    field: FieldAttributes<{}>;
    form: FormikProps<{}>;
    labelKey: string; // Used to access the label on the object.
    searchKey: string; // Name of the variable that we use as the search key.
    dataKey: string; // Used to access the data after a successful query.
    document: DocumentNode; // GraphQL document the query is made with.
    variables: OperationVariables; // Custom variables for GraphQL query.
    multiple?: boolean;
}

// A custom auto-complete form field that always fetches translated options from backend.
export const AutoCompleteField: React.FC<Props & TextFieldProps> = <T extends {}>({
    field,
    form,
    labelKey = 'name',
    searchKey,
    dataKey,
    document,
    helperText,
    disabled,
    variables: queryVariables,
    multiple,
    ...textFieldProps
}: Props & TextFieldProps) => {
    const classes = useStyles();
    const queryOptions = useQueryOptions();
    const [open, setOpen] = useState(false);
    const handleOpen = (): void => setOpen(true);
    const handleClose = (): void => setOpen(false);
    const getOptionLabel = (option: T): string => R.propOr('', labelKey, option);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value);
    const apolloClient = useApolloClient();
    const { name, value } = field;
    const { touched, errors, isSubmitting } = form;
    const fieldError = getIn(errors, name);
    const showError = getIn(touched, name) && !!fieldError;

    const fetchOptions = async (): Promise<void> => {
        setLoading(true);

        // Add search params to existing query variables.
        const searchVariables = {
            ...queryVariables,
            [searchKey]: inputValue,
        };

        // Use only existing query variables if no search key is provided.
        const variables = !!searchKey ? searchVariables : queryVariables;

        try {
            const { data } = await apolloClient.query({
                ...queryOptions,
                query: document,
                variables,
            });

            data[dataKey] && setOptions(data[dataKey]);
        } catch {
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    // When closing the input results, reset the options.
    // When input has empty content, fetch default content with no params.
    // Otherwise require the user to type at least three characters.
    // After the user has typed at least three characters, fetch content from backend on each new character.
    useEffect(() => {
        if (!open) {
            setOptions([]);
        } else if (inputValue === '' || inputValue.length > 2) {
            fetchOptions();
        }
    }, [open, inputValue]);

    const handleAutoCompleteChange = (_e: ChangeEvent<{}>, val: T | T[] | null): void => {
        console.log('test');
        !!val ? form.setFieldValue(name, val) : form.setFieldValue(name, null);
    };

    const renderInput = (params: AutocompleteRenderInputParams): JSX.Element => (
        <TextField
            {...params}
            {...textFieldProps}
            error={showError}
            helperText={showError ? fieldError : helperText}
            onChange={handleInputChange}
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
            classes={{ endAdornment: classes.endAdornment }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            value={value}
            onChange={handleAutoCompleteChange}
            renderInput={renderInput}
            disabled={disabled !== undefined ? disabled : isSubmitting}
            multiple={multiple}
        />
    );
};
