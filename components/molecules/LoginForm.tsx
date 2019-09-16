import { ErrorMessage, Field, Form, FormikProps } from 'formik';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { Button, FormErrorMessage, LoadingIndicator, TextInputFormField } from '../atoms';
import { Column } from '../containers';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = ({ isSubmitting }) => (
  <Form>
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
    <Column>
      {isSubmitting ? (
        <LoadingIndicator />
      ) : (
        <ErrorMessage name="general" component={FormErrorMessage} />
      )}
    </Column>
    <Button type="submit" disabled={isSubmitting}>
      login
    </Button>
  </Form>
);
