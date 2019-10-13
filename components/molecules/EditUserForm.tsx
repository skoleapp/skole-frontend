import { Field, FormikProps } from 'formik';
import React from 'react';
import { User } from '../../interfaces';
import {
  Form,
  FormLinkSection,
  FormSubmitSection,
  SelectFormField,
  TextInputFormField
} from '../atoms';

export const EditUserForm: React.ComponentType<FormikProps<User>> = props => (
  <Form {...props}>
    <Field placeholder="Title" name="title" component={TextInputFormField} label="Title" />
    <Field placeholder="Username" name="username" component={TextInputFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextInputFormField} label="Email" />
    <Field placeholder="Bio" name="bio" component={TextInputFormField} label="Bio" />
    <Field placeholder="Language" name="language" component={SelectFormField} label="Language">
      <option value="english">English</option>
      <option value="finnish">Finnish</option>
    </Field>
    <FormSubmitSection submitButtonText="save" {...props} />
    <FormLinkSection href="/account" text="Back to Account" />
  </Form>
);
