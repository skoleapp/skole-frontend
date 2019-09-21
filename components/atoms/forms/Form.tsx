import { Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues, RegisterFormValues, SearchFormProps, User } from '../../../interfaces';

type AnyForm = LoginFormValues | RegisterFormValues | SearchFormProps | User;

export const Form: React.ComponentType<FormikProps<AnyForm>> = ({ handleSubmit, children }) => (
  <FormikForm onKeyDown={(e): false | void => e.key === 'Enter' && handleSubmit()}>
    {children}
  </FormikForm>
);
