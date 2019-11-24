import { Avatar, Box, Button, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormErrorMessage, FormSubmitSection, StyledForm } from '.';
import { UpdateUserFormValues } from '../interfaces';
import { getAvatar } from '../utils';

export const EditProfileForm: React.ComponentType<FormikProps<UpdateUserFormValues>> = props => {
  const [avatar, setAvatar] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    const objectUrl = avatar && URL.createObjectURL(avatar);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAvatarChange = (e: ChangeEvent<any>) => {
    const newAvatar = e.currentTarget.files[0];
    props.setFieldValue('avatar', newAvatar);
    newAvatar && setAvatar(newAvatar);
  };

  return (
    <StyledForm>
      <FormControl fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center" className="file-input">
          <Avatar src={avatar ? preview : getAvatar(props.values.avatar)} />
          <Field
            value=""
            name="avatar"
            id="avatar-input"
            accept="image/*"
            type="file"
            component="input"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-input">
            <Button variant="outlined" color="primary" component="span" fullWidth>
              change avatar
            </Button>
          </label>
          <ErrorMessage name="avatar" component={FormErrorMessage} />
        </Box>
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
    </StyledForm>
  );
};
