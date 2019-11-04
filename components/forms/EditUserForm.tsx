import { Avatar, Button, Link } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { UpdateUserForm } from '../../interfaces';
import { Form } from '../containers';
import { FormErrorMessage } from '../containers/FormErrorMessage';
import { FormSubmitSection, SelectFormField } from '../form-fields';

const languageOptions = [
  {
    value: 'ENGLISH',
    label: 'English'
  },
  {
    value: 'FINNISH',
    label: 'Finnish'
  }
];

export const EditUserForm: React.ComponentType<FormikProps<UpdateUserForm>> = props => (
  <Form>
    <div className="avatar-section">
      <Avatar src="https://myconstructor.gr/img/customers-imgs/avatar.png" />
      <input accept="image/*" id="upload-avatar" type="file" />
      <label htmlFor="upload-avatar">
        <Button variant="outlined" color="primary" component="span" fullWidth>
          upload new avatar
        </Button>
      </label>
      <ErrorMessage name="avatar" component={FormErrorMessage} />
    </div>
    <Field placeholder="Title" name="title" component={TextField} label="Title" fullWidth />
    <Field
      placeholder="Username"
      name="username"
      component={TextField}
      label="Username"
      fullWidth
    />
    <Field placeholder="Email" name="email" component={TextField} label="Email" fullWidth />
    <Field placeholder="Bio" name="bio" component={TextField} label="Bio" fullWidth />
    <Field
      placeholder="Language"
      name="language"
      component={SelectFormField}
      options={languageOptions}
      label="Language"
    />
    <FormSubmitSection submitButtonText="save" {...props} />
    <Link href="/account" color="primary">
      Back to Account
    </Link>
  </Form>
);
