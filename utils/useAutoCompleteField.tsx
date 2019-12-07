import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { ChangeEvent, useState } from 'react';
import { Course, School, Subject } from '../interfaces';

// eslint-disable-next-line @eslint-typescript/no-explicit-any
interface Props<T> extends FormikProps<any> {
  options: T[];
  initialValue: string;
  dataKey: string;
  fieldName: string;
  label: string;
}

// A hook to easily render an auto complete field.
export const useAutoCompleteField = <T extends Course | School | Subject>({
  options,
  initialValue,
  dataKey,
  setFieldValue,
  fieldName,
  label
}: Props<T>) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (_e: ChangeEvent<{}>, val: T) => {
    val ? setFieldValue(fieldName, val[dataKey as keyof T]) : setFieldValue(fieldName, '');
    val ? setValue(val.name) : setValue('');
  };

  const renderAutoCompleteField = (
    <Autocomplete
      getOptionLabel={(option: T) => option.name}
      options={options}
      onChange={handleChange}
      renderInput={({ inputProps, ...params }: RenderInputParams) => {
        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
          (inputProps as any).onChange(e);
          setValue(e.target.value);
        };

        const customInputProps = { ...inputProps, value, onChange };

        return (
          <Field
            {...params}
            inputProps={customInputProps}
            component={TextField}
            name={fieldName}
            label={label}
            fullWidth
          />
        );
      }}
    />
  );

  return { renderAutoCompleteField };
};
