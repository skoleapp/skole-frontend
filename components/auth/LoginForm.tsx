import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { LoginFormValues } from '../../interfaces';
import { FormSubmitSection, StyledForm } from '../shared';

export const LoginForm: React.ComponentType<FormikProps<LoginFormValues>> = props => (
  <StyledForm>
    <Field
      placeholder="example@skole.io"
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
  </StyledForm>
);
