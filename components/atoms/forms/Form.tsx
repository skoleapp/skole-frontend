import { Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues, RegisterFormValues } from '../../../interfaces';

interface Props extends FormikProps<LoginFormValues | RegisterFormValues> {}

export const Form: React.ComponentType<Props> = ({ handleSubmit, children }) => (
  <FormikForm onKeyDown={e => e.key === 'Enter' && handleSubmit()}>{children}</FormikForm>
);
