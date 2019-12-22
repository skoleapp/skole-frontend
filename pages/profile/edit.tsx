import { Avatar, Box, Button, CardHeader, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { NextPage } from 'next';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification, reAuthenticate } from '../../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { useUpdateUserMutation } from '../../generated/graphql';
import { FormCompleted, SkoleContext, State, UpdateProfileFormValues } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePrivatePage } from '../../utils';

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  username: Yup.string().required('Username is required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  bio: Yup.string()
});

const EditProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { ref, onError, setSubmitting, setFieldValue } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ updateUser }: FormCompleted): void => {
    if (updateUser.errors) {
      return onError(updateUser.errors);
    } else {
      dispatch(reAuthenticate(updateUser.user));
      dispatch(openNotification('Profile updated!'));
    }
  };

  const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError });

  const handleSubmit = async (values: UpdateProfileFormValues): Promise<void> => {
    const { username, email, title, bio, avatar } = values;

    await updateUserMutation({
      variables: {
        username,
        email,
        title,
        bio,
        avatar
      }
    });

    setSubmitting(false);
  };

  const initialValues = {
    id: R.propOr('', 'id', user) as string,
    title: R.propOr('', 'title', user) as string,
    username: R.propOr('', 'username', user) as string,
    email: R.propOr('', 'email', user) as string,
    bio: R.propOr('', 'bio', user) as string,
    avatar: R.propOr('', 'avatar', user) as string,
    general: ''
  };

  const [avatar, setAvatar] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    const objectUrl = avatar && URL.createObjectURL(avatar);
    setPreview(objectUrl);
    return (): void => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newAvatar = R.path(['currentTarget', 'files', '0'], e);
    setFieldValue('avatar', newAvatar);
    newAvatar && setAvatar(newAvatar);
  };

  const renderForm = (props: FormikProps<UpdateProfileFormValues>) => (
    <StyledForm>
      <FormControl fullWidth>
        <Box display="flex" flexDirection="column" alignItems="center" className="file-input">
          <Avatar
            className="main-avatar"
            src={avatar ? preview : process.env.BACKEND_URL + props.values.avatar}
          />
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
                change avatar
              </Button>
            </label>
          </Box>
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
      <Field placeholder="Bio" name="bio" component={TextField} label="Bio" multiline fullWidth />
      <FormSubmitSection submitButtonText="save" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Edit Profile" backUrl>
      <StyledCard>
        <CardHeader title="Edit Profile" />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(EditProfilePage);
