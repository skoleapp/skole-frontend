import { Box, FormControl, Link, Typography } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { RegisterFormValues } from '../../interfaces';
import { FormSubmitSection, StyledForm } from '../shared';

export const RegisterForm: React.FC<FormikProps<RegisterFormValues>> = props => (
  <StyledForm>
    <Field
      placeholder="Username"
      name="username"
      component={TextField}
      label="Username"
      fullWidth
    />
    <Field
      placeholder="example@skole.io"
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
    <Field
      placeholder="Confirm password"
      name="confirmPassword"
      type="password"
      component={TextField}
      label="Confirm Password"
      fullWidth
    />
    <FormControl fullWidth>
      <Box marginTop="0.5rem">
        <Typography variant="body2" color="textSecondary">
          By registering you agree to our{' '}
          <Link href="/terms" target="_blank">
            Terms
          </Link>
          .
        </Typography>
      </Box>
    </FormControl>
    <FormSubmitSection submitButtonText="register" {...props} />
  </StyledForm>
);
