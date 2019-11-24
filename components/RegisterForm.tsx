import { Box, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage, FormSubmitSection, StyledForm, TextLink } from '.';
import { RegisterFormValues } from '../interfaces';

export const RegisterForm: React.FC<FormikProps<RegisterFormValues>> = props => (
  <StyledForm>
    <Field
      placeholder="Username"
      name="username"
      component={TextField}
      label="Username"
      fullWidth
    />
    <Field placeholder="Email" name="email" component={TextField} label="Email" fullWidth />
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
      <Box>
        <Field
          name="agreeToTerms"
          component={CheckboxWithLabel}
          Label={{ label: 'Agree to Terms' }}
          color="primary"
        />
        <ErrorMessage name="agreeToTerms" component={FormErrorMessage} />
      </Box>
    </FormControl>
    <FormSubmitSection submitButtonText="register" {...props} />
    <FormControl>
      <TextLink href="/login" color="primary">
        Already a user?
      </TextLink>
    </FormControl>
  </StyledForm>
);
