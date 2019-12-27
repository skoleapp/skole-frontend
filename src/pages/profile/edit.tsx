import { Avatar, Box, Button, CardHeader, FormControl } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { useUpdateUserMutation } from '../../../generated/graphql';
import { openNotification, reAuthenticate } from '../../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import {
  FormCompleted,
  I18nPage,
  I18nProps,
  SkoleContext,
  State,
  UpdateProfileFormValues
} from '../../types';
import { useForm, usePrivatePage } from '../../utils';

const EditProfilePage: I18nPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { ref, onError, setSubmitting, setFieldValue } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onCompleted = ({ updateUser }: FormCompleted): void => {
    if (updateUser.errors) {
      return onError(updateUser.errors);
    } else {
      dispatch(reAuthenticate(updateUser.user));
      dispatch(openNotification(t('notifications:profileUpdated')));
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

  const validationSchema = Yup.object().shape({
    title: Yup.string(),
    username: Yup.string().required(t('validation:usernameRequired')),
    email: Yup.string()
      .email(t('validation:invalidEmail'))
      .required(t('validation:emailRequired')),
    bio: Yup.string()
  });

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
                {t('edit-profile:changeAvatarButton')}
              </Button>
            </label>
          </Box>
          <ErrorMessage name="avatar" component={FormErrorMessage} />
        </Box>
      </FormControl>
      <Field
        placeholder={t('forms:title')}
        name="title"
        component={TextField}
        label={t('forms:title')}
        fullWidth
      />
      <Field
        placeholder={t('forms:username')}
        name="username"
        component={TextField}
        label={t('forms:username')}
        fullWidth
      />
      <Field
        placeholder={t('forms:email')}
        name="email"
        component={TextField}
        label={t('forms:email')}
        fullWidth
      />
      <Field
        placeholder={t('forms:bio')}
        name="bio"
        component={TextField}
        label={t('forms:bio')}
        multiline
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('edit-profile:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('edit-profile:title')} />
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

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePrivatePage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces([
      'edit-profile',
      'forms',
      'validation',
      'notifications'
    ])
  };
};

export default compose(withApollo, withRedux)(EditProfilePage);
