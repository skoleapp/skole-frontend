import { Field, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { Form, FormSubmitSection, TextInputFormField } from '../atoms';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <Form {...props}>
    <Field
      placeholder="Username or email"
      name="usernameOrEmail"
      component={TextInputFormField}
      label="Username or email"
    />
    <Field
      placeholder="Password"
      name="password"
      component={TextInputFormField}
      label="Password"
      type="password"
    />
    <FormSubmitSection submitButtonText="login" {...props} />
  </Form>
);
