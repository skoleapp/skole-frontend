import { Link } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { PasswordForm } from '../../interfaces';
import { FormSubmitSection, TextFormField } from '../form-fields';

export const ChangePasswordForm: React.ComponentType<FormikProps<PasswordForm>> = props => (
  <Form>
    <Field
      placeholder="Old Password"
      name="oldPassword"
      component={TextFormField}
      label="Old Password"
      type="password"
    />
    <Field
      placeholder="New Password"
      name="newPassword"
      component={TextFormField}
      label="New Password"
      type="password"
    />
    <Field
      placeholder="Confirm New Passsword"
      name="confirmNewPassword"
      component={TextFormField}
      label="Confirm New Password"
      type="password"
    />
    <FormSubmitSection submitButtonText="save" {...props} />
    <Link href="/account" color="primary">
      Back to Account
    </Link>
  </Form>
);
