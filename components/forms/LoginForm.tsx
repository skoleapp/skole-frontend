import { Link } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { FormSubmitSection, TextFormField } from '../form-fields';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <Form>
    <Field placeholder="example@skole.com" name="email" component={TextFormField} label="Email" />
    <Field
      placeholder="Password"
      name="password"
      component={TextFormField}
      label="Password"
      type="password"
    />
    <FormSubmitSection submitButtonText="login" {...props} />
    <Link href="/register" color="primary">
      New User?
    </Link>
  </Form>
);
