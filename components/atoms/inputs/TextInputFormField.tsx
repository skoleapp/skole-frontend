import { ErrorMessage } from 'formik';
import React from 'react';
import { Label, TextInput } from '.';
import { FormFieldProps } from '../../../interfaces';
import { Column } from '../../containers';
import { FormErrorMessage } from '../forms/FormErrorMessage';

export const TextInputFormField: React.FC<FormFieldProps> = ({ field, label, ...props }) => (
  <Column>
    <Label>{label}</Label>
    <TextInput {...field} {...props} />
    <ErrorMessage name={field.name} component={FormErrorMessage} />
  </Column>
);
