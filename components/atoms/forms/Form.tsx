import { Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues, RegisterFormValues } from '../../../interfaces';

export const Form: React.ComponentType<FormikProps<LoginFormValues | RegisterFormValues>> = ({
  handleSubmit,
  children
}) => (
  <FormikForm onKeyDown={(e): false | void => e.key === 'Enter' && handleSubmit()}>
    {children}
  </FormikForm>
);
