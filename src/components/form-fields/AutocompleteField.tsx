import { OperationVariables, useApolloClient, DocumentNode } from '@apollo/client';
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import { FieldAttributes, FormikProps, FormikValues, getIn } from 'formik';

import { useLanguageHeaderContext } from 'hooks';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface Props {
  field: FieldAttributes<FormikValues>;
  form: FormikProps<FormikValues>;
  labelKey: string; // Used to access the label on the object.
  searchKey: string; // Name of the variable that we use as the search key.
  dataKey: string; // Used to access the data after a successful query.
  document: DocumentNode; // GraphQL document the query is made with.
  variables: OperationVariables; // Custom variables for GraphQL query.
  multiple?: boolean;
}

// A custom auto-complete form field that always fetches translated options from backend.
export const AutocompleteField: React.FC<Props & TextFieldProps> = ({
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
}) => {
  const context = useLanguageHeaderContext();
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const apolloClient = useApolloClient();
  const { name, value } = field;
  const { touched, errors, isSubmitting } = form;
  const fieldError = getIn(errors, name);
  const showError = getIn(touched, name) && !!fieldError;

  const getOptionLabel = (option: Record<symbol, unknown>): string =>
    R.propOr('', labelKey, option);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setInputValue(e.target.value);

  const fetchOptions = async (): Promise<void> => {
    setLoading(true);

    // Add search params to existing query variables.
    const searchVariables = {
      ...queryVariables,
      [searchKey]: inputValue,
    };

    // Use only existing query variables if no search key is provided.
    const variables = searchKey ? searchVariables : queryVariables;

    try {
      const { data } = await apolloClient.query({
        query: document,
        variables,
        context,
      });

      // Filter out options that have already been chosen.
      const filteredOptions = data[dataKey].filter(
        (o: Record<string, unknown>) =>
          !field.value?.some((v: Record<string, unknown>) => v.id === o.id),
      );

      setOptions(filteredOptions);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // For all auto complete fields, fetch the data when opening the input.
  // When closing the input results, reset the options.
  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      fetchOptions();
    }

    return (): void => {
      setOptions([]);
    };
  }, [open]);

  // For fields that perform filtering in the backend with the search variables, perform the data fetching also in the following cases:
  // 1. Input field contains at least two characters and a new character is typed.
  // 2. Input field is cleared to default value (empty string).
  useEffect(() => {
    if (!!searchKey && (inputValue === '' || inputValue.length > 2)) {
      fetchOptions();
    }
  }, [inputValue]);

  const handleAutocompleteChange = <T extends Record<symbol, unknown>>(
    _e: ChangeEvent<T>,
    val: T | T[] | null,
  ): void => {
    val ? form.setFieldValue(name, val) : form.setFieldValue(name, null);
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
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      value={value}
      onChange={handleAutocompleteChange}
      renderInput={renderInput}
      disabled={disabled !== undefined ? disabled : isSubmitting}
      multiple={multiple}
    />
  );
};
