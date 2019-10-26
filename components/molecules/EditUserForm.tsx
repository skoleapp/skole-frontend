import { Link } from '@material-ui/core';
import { Field, Form, FormikProps } from 'formik';
import React from 'react';
import { User } from '../../interfaces';
import { FormSubmitSection, SelectFormField, TextFormField } from '../atoms';

const languageOptions = [
  {
    value: 'english',
    label: 'english'
  },
  {
    value: 'finnish',
    label: 'finnish'
  }
];

export const EditUserForm: React.ComponentType<FormikProps<User>> = props => (
  <Form>
    <Field placeholder="Title" name="title" component={TextFormField} label="Title" />
    <Field placeholder="Username" name="username" component={TextFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextFormField} label="Email" />
    <Field placeholder="Bio" name="bio" component={TextFormField} label="Bio" />
    <Field
      placeholder="Language"
      name="language"
      component={SelectFormField}
      options={languageOptions}
      label="Language"
    />
    <FormSubmitSection submitButtonText="save" {...props} />
    <Link href={`/user/${props.values.id}`} color="primary">
      Back to Account
    </Link>
  </Form>
);
