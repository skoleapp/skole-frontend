import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { FormSubmitSection, TextInputFormField } from '../atoms';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <Form onKeyDown={e => e.key === 'Enter' && props.handleSubmit()}>
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
