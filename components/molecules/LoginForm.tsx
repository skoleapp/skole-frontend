import { Field, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { Form, FormLinkSection, FormSubmitSection, TextInputFormField } from '../atoms';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <Form {...props}>
    <Field
      placeholder="example@skole.com"
      name="email"
      component={TextInputFormField}
      label="Email"
    />
    <Field
      placeholder="Password"
      name="password"
      component={TextInputFormField}
      label="Password"
      type="password"
    />
    <FormSubmitSection submitButtonText="login" {...props} />
    <FormLinkSection href="/register" text="New User?" />
  </Form>
);
