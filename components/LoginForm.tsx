import { FormControl } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, StyledForm, TextLink } from '.';
import { LoginFormValues } from '../interfaces';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <StyledForm>
    <Field
      placeholder="example@skole.com"
      name="usernameOrEmail"
      component={TextField}
      label="Username or Email"
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
    <FormControl>
      <TextLink href="/register" color="primary">
        New user?
      </TextLink>
    </FormControl>
  </StyledForm>
);
