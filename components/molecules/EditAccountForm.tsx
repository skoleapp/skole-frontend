import { Field, FormikProps } from 'formik';
import React from 'react';
import { User } from '../../interfaces';
import { Form, FormSubmitSection, TextInputFormField } from '../atoms';

export const EditAccountForm: React.ComponentType<FormikProps<User>> = props => (
  <Form {...props}>
    <Field placeholder="Title" name="title" component={TextInputFormField} label="Title" />
    <Field placeholder="Username" name="username" component={TextInputFormField} label="Username" />
    <Field placeholder="Email" name="email" component={TextInputFormField} label="Email" />
    <Field placeholder="Bio" name="bio" component={TextInputFormField} label="Bio" />
    <Field placeholder="Language" name="language" component={TextInputFormField} label="Language" />
    <FormSubmitSection submitButtonText="save" {...props} />
  </Form>
);
