import { Link } from '@material-ui/core';
import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { PasswordForm } from '../../interfaces';
import { Form } from '../containers';
import { FormSubmitSection } from '../molecules';

export const ChangePasswordForm: React.ComponentType<FormikProps<PasswordForm>> = props => (
  <Form>
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
    <Link href="/account" color="primary">
      Back to Account
    </Link>
  </Form>
);
