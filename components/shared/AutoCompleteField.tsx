import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Course,
  CreateCourseFormValues,
  FilterSearchResultsFormValues,
  School,
  Subject
} from '../../interfaces';

interface Props extends FormikProps<FilterSearchResultsFormValues | CreateCourseFormValues> {
  options?: School[] | Subject[];
  initialValue?: School | Subject;
  fieldName: string;
  label: string;
}

export const AutoCompleteField: React.FC<Props> = ({
  setFieldValue,
  options,
  initialValue,
  fieldName,
  label
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(R.propOr('', 'name', initialValue));

  useEffect(() => {
    initialValue ? setInputValue(initialValue.name) : setInputValue('');
  }, [router.query]);

  const handleChange = (_e: ChangeEvent<{}>, val: Course) => {
    val ? setFieldValue(fieldName, val.id) : setFieldValue(fieldName, '');
  };

  const handleInputChange = (_e: ChangeEvent<{}>, val: string) => setInputValue(val);

  return (
    <Autocomplete
      getOptionLabel={option => option.name}
      options={options}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={(params: RenderInputParams) => (
        <Field {...params} component={TextField} name={fieldName} label={label} fullWidth />
      )}
    />
  );
};
