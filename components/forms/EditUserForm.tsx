import { Link } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { UpdateUserForm } from '../../interfaces';
import { FormSubmitSection, SelectFormField, TextFormField } from '../form-fields';

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
    <Field placeholder="Title" name="title" component={TextFormField} label="Title" />
    <Field placeholder="Username" name="username" component={TextFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextFormField} label="Email" />
    <Field placeholder="Bio" name="bio" component={TextFormField} label="Bio" />
    <Field placeholder="Avatar" name="avatar" component={TextFormField} label="Avatar" />
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
