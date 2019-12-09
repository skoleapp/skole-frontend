import { CircularProgress } from '@material-ui/core';
import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { SchoolDetailDocument, SchoolListDocument } from '../../generated/graphql';
import { Course, CreateCourseFormValues, FilterSearchResultsFormValues } from '../../interfaces';

type Props = FormikProps<FilterSearchResultsFormValues | CreateCourseFormValues>;

export const SchoolAutoCompleteField: React.FC<Props> = ({ setFieldValue }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();
  const router = useRouter();
  const { schoolId } = router.query;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = useRef<any>();

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data } = await apolloClient.query({ query: SchoolListDocument });
      data.schools && setOptions(data.schools);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialValue = async () => {
    setLoading(true);

    try {
      const { data } = await apolloClient.query({
        query: SchoolDetailDocument,
        variables: { schoolId }
      });

      !!data.school && setValue(data.school.name);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    schoolId && fetchInitialValue();
  }, []);

  useEffect(() => {
    !!open && fetchData();
  }, [open]);

  const handleChange = (_e: ChangeEvent<{}>, val: Course) => {
    val ? setFieldValue('schoolId', val.id) : setFieldValue('schoolId', '');
    val ? setValue(val.name) : setValue('');
  };

  const renderInput = ({ inputProps, ...params }: RenderInputParams) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      (inputProps as any).onChange(e);
      setValue(e.target.value);
    };

    const customInputProps = {
      ...inputProps,
      value,
      onChange
    };

    return (
      <Field
        name="schoolId"
        label="School"
        component={TextField}
        inputProps={customInputProps}
        fullWidth
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="primary" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    );
  };

  return (
    <Autocomplete
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      // getOptionSelected={(option: any, value: any) => option.name === value.name}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      onChange={handleChange}
      renderInput={renderInput}
      ref={ref}
    />
  );
};
