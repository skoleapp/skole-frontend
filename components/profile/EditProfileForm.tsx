import { Avatar, Box, Button, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { UpdateUserFormValues } from '../../interfaces';
import { getAvatar } from '../../utils';
import { FormErrorMessage, FormSubmitSection, StyledForm } from '../shared';

interface Props extends FormikProps<UpdateUserFormValues> {
  t: (value: string) => any;
}

export const EditProfileForm: React.ComponentType<Props> = props => {
  const [avatar, setAvatar] = useState();
  const [preview, setPreview] = useState();

  const t = props.t;

  useEffect(() => {
    const objectUrl = avatar && URL.createObjectURL(avatar);
    setPreview(objectUrl);
    return (): void => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newAvatar = R.path(['currentTarget', 'files', '0'], e);
    props.setFieldValue('avatar', newAvatar);
    newAvatar && setAvatar(newAvatar);
  };

  return (
    <StyledForm>
      <FormControl fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center" className="file-input">
          <Avatar className="main-avatar" src={avatar ? preview : getAvatar(props.values.avatar)} />
          <Field
            value=""
            name="avatar"
            id="avatar-input"
            accept="image/*"
            type="file"
            component="input"
            onChange={handleAvatarChange}
          />
          <Box marginTop="0.5rem">
            <label htmlFor="avatar-input">
              <Button variant="outlined" color="primary" component="span">
                {t('buttonChangeAvatar')}
              </Button>
            </label>
          </Box>
          <ErrorMessage name="avatar" component={FormErrorMessage} />
        </Box>
      </FormControl>
      <Field
        placeholder={t('fieldTitle')}
        name="title"
        component={TextField}
        label={t('fieldTitle')}
        fullWidth
      />
      <Field
        placeholder={t('fieldUsername')}
        name="username"
        component={TextField}
        label={t('fieldUsername')}
        fullWidth
      />
      <Field
        placeholder={t('fieldEmail')}
        name="email"
        component={TextField}
        label={t('fieldEmail')}
        fullWidth
      />
      <Field
        placeholder={t('fieldBio')}
        name="bio"
        component={TextField}
        label={t('fieldBio')}
        multiline
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('buttonSave')} {...props} />
    </StyledForm>
  );
};
