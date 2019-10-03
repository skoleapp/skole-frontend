import { Form as FormikForm, FormikProps } from 'formik';
import React from 'react';
import { AnyForm } from '../../../interfaces';

export const Form: React.ComponentType<FormikProps<AnyForm>> = ({ handleSubmit, children }) => (
  <FormikForm onKeyDown={(e): false | void => e.key === 'Enter' && handleSubmit()}>
    {children}
  </FormikForm>
);
