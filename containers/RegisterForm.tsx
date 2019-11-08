import { Link } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage, FormSubmitSection, StyledForm } from '../components';
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
    <div className="checkbox-section">
      <Field
        name="agreeToTerms"
        component={CheckboxWithLabel}
        Label={{ label: 'Agree to Terms' }}
        color="primary"
      />
      <ErrorMessage name="agreeToTerms" component={FormErrorMessage} />
    </div>
    <FormSubmitSection submitButtonText="register" {...props} />
    <Link href="/login" color="primary">
      Already a user?
    </Link>
  </StyledForm>
);
