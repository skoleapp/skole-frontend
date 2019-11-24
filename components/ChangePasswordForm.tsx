import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, StyledForm } from '.';
import { PasswordForm } from '../interfaces';

export const ChangePasswordForm: React.ComponentType<FormikProps<PasswordForm>> = props => (
  <StyledForm>
    <Field
      placeholder="Old Password"
      name="oldPassword"
      component={TextField}
      label="Old Password"
      type="password"
      fullWidth
    />
    <Field
      placeholder="New Password"
      name="newPassword"
      component={TextField}
      label="New Password"
      type="password"
      fullWidth
    />
    <Field
      placeholder="Confirm New Passsword"
      name="confirmNewPassword"
      component={TextField}
      label="Confirm New Password"
      type="password"
      fullWidth
    />
    <FormSubmitSection submitButtonText="save" {...props} />
  </StyledForm>
);
