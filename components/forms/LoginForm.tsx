import { Link } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { Form } from '../containers';
import { FormSubmitSection } from '../molecules';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <Form>
    <Field
      placeholder="example@skole.com"
      name="email"
      component={TextField}
      label="Email"
      fullWidth
    />
    <Field
      placeholder="Password"
      name="password"
      component={TextField}
      label="Password"
      type="password"
      fullWidth
    />
    <FormSubmitSection submitButtonText="login" {...props} />
    <Link href="/register" color="primary">
      New User?
    </Link>
  </Form>
);
