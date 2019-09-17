import { Field, FormikProps } from 'formik';
import React from 'react';
import { RegisterFormValues } from '../../interfaces';
import { CheckboxFormField, Form, FormSubmitSection, TextInputFormField } from '../atoms';

export const RegisterForm: React.ComponentType<FormikProps<RegisterFormValues>> = props => (
  <Form {...props}>
    <Field placeholder="Username" name="username" component={TextInputFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextInputFormField} label="Email" />
    <Field
      placeholder="Password"
      name="password"
      component={TextInputFormField}
      label="Password"
      type="password"
    />
    <Field
      placeholder="Confirm password"
      name="confirmPassword"
      type="password"
      component={TextInputFormField}
      label="Confirm Password"
    />
    <Field name="agreeToTerms" component={CheckboxFormField} label="Agree to Terms" />
    <FormSubmitSection submitButtonText="register" {...props} />
  </Form>
);
