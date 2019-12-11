import { Autocomplete, RenderInputParams } from '@material-ui/lab';
import { Field, FormikProps, FormikValues } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { ChangeEvent } from 'react';
import {
  City,
  Country,
  Course,
  FilterSearchResultsFormValues,
  ResourceType,
  School,
  Subject,
  UploadResourceFormValues
} from '../../interfaces';

type Forms = FilterSearchResultsFormValues | UploadResourceFormValues;
type Options = School | Subject | Course | ResourceType | City | Country;

interface Props<F, O> extends FormikProps<F> {
  options?: O[];
  fieldName: string;
  optionKey: string;
  label: string;
}

export const AutoCompleteField: React.FC<Props<Forms, Options>> = ({
  values,
  options,
  fieldName,
  optionKey,
  label,
  setFieldValue
}) => {
  const handleChange = <T extends Options>(_e: ChangeEvent<{}>, val: T) => {
    val ? setFieldValue(fieldName, val[optionKey as keyof T]) : setFieldValue(fieldName, '');
  };

  return (
    <Autocomplete
      getOptionLabel={option => option.name}
      options={options}
      onChange={handleChange}
      inputValue={(values as FormikValues)[fieldName]}
      renderInput={(params: RenderInputParams) => (
        <Field {...params} component={TextField} name={fieldName} label={label} fullWidth />
      )}
    />
  );
};
