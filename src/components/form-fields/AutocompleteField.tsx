import { DocumentNode, OperationVariables, useApolloClient } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import { FieldAttributes, FormikProps, FormikValues, getIn } from 'formik';
import { useLanguageHeaderContext } from 'hooks';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface Props {
  field: FieldAttributes<FormikValues>;
  form: FormikProps<FormikValues>;
  labelKeys?: string[]; // Used to access the label on the object.
  suffixKey?: string; // Key of value show after the label, e.g. a course code.
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
  labelKeys = ['name'],
  suffixKey,
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

  const getOptionLabel = (option: Record<string, string>): string => {
    const suffix = R.propOr('', suffixKey, option);
    let label = '';

    labelKeys.forEach((l) => {
      label = R.propOr(label, l, option);
    });

    if (suffix) {
      label = `${label} (${suffix})`;
    }

    return label;
  };

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

  // For all autocomplete fields, fetch the data when opening the input.
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

  // For fields that perform filtering in the backend with the search variables, refetch the data on every key stroke.
  useEffect(() => {
    !!searchKey && fetchOptions();
  }, [inputValue]);

  // Close the options when clearing the value.
  const handleClearSelection = () => {
    form.setFieldValue(name, null);
    handleClose();
  };

  const handleAutocompleteChange = <T extends Record<symbol, unknown>>(
    _e: ChangeEvent<T>,
    val: T | T[] | null,
  ): void => {
    val ? form.setFieldValue(name, val) : handleClearSelection();
  };

  const getOptionSelected = (option: Record<string, unknown>, value: Record<string, unknown>) =>
    option.id === value?.id;

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
            {loading && <CircularProgress size={20} />}
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
      getOptionSelected={getOptionSelected}
      onChange={handleAutocompleteChange}
      renderInput={renderInput}
      disabled={disabled !== undefined ? disabled : isSubmitting}
      multiple={multiple}
    />
  );
};
