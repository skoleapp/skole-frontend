import { Link } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { RegisterFormValues } from '../../interfaces';
import { CheckboxFormField, FormSubmitSection, TextFormField } from '../form-fields';

export const RegisterForm: React.ComponentType<FormikProps<RegisterFormValues>> = props => (
  <Form>
    <Field placeholder="Username" name="username" component={TextFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextFormField} label="Email" />
    <Field
      placeholder="Password"
      name="password"
      component={TextFormField}
      label="Password"
      type="password"
    />
    <Field
      placeholder="Confirm password"
      name="confirmPassword"
      type="password"
      component={TextFormField}
      label="Confirm Password"
    />
    <Field name="agreeToTerms" component={CheckboxFormField} label="Agree to Terms" />
    <FormSubmitSection submitButtonText="register" {...props} />
    <Link href="/login" color="primary">
      Already a user?
    </Link>
  </Form>
);
