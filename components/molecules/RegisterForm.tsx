import { ErrorMessage, Field, Form, FormikProps } from 'formik';
import React from 'react';
import { RegisterFormValues } from '../../interfaces';
import {
  Button,
  CheckboxFormField,
  FormErrorMessage,
  LoadingIndicator,
  TextInputFormField
} from '../atoms';
import { Column } from '../containers';

export const RegisterForm: React.ComponentType<FormikProps<RegisterFormValues>> = ({
  isSubmitting
}) => (
  <Form>
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
    <Column>
      {isSubmitting ? (
        <LoadingIndicator />
      ) : (
        <ErrorMessage name="general" component={FormErrorMessage} />
      )}
    </Column>
    <Button type="submit" disabled={isSubmitting}>
      register
    </Button>
  </Form>
);
