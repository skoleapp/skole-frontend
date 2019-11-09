import { Avatar, Button, FormControl, InputLabel, Link, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { FormErrorMessage, FormSubmitSection, StyledForm } from '../components';
import { UpdateUserFormValues } from '../interfaces';
import { getAvatar } from '../utils';

export const EditUserForm: React.ComponentType<FormikProps<UpdateUserFormValues>> = props => (
  <StyledForm>
    <Avatar src={getAvatar(props.values.avatar)} />
    <div className="change-avatar">
      <input accept="image/*" type="file" />
      <label>
        <Button variant="outlined" color="primary" component="span" fullWidth>
          change avatar
        </Button>
      </label>
      <ErrorMessage name="avatar" component={FormErrorMessage} />
    </div>
    <FormControl fullWidth>
      <InputLabel>Language</InputLabel>
      <Field name="language" component={Select} fullWidth>
        <MenuItem value="English">English</MenuItem>
        <MenuItem value="Finnish">Finnish</MenuItem>
        <MenuItem value="Swedish">Swedish</MenuItem>
      </Field>
      <ErrorMessage name="language" component={FormErrorMessage} />
    </FormControl>
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
    <FormSubmitSection submitButtonText="save" {...props} />
    <Link href="/account" color="primary">
      Back to Account
    </Link>
  </StyledForm>
);
