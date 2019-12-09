import { CardHeader } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification, updateUserMe } from '../../actions';
import { EditProfileForm, Layout, SlimCardContent, StyledCard } from '../../components';
import { useUpdateUserMutation } from '../../generated/graphql';
import { FormCompleted, SkoleContext, State, UpdateUserFormValues } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePrivatePage } from '../../utils';
import { withTranslation } from '../../i18n';

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
  const { ref, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ updateUser }: FormCompleted): void => {
    if (updateUser.errors) {
      return onError(updateUser.errors);
    } else {
      dispatch(updateUserMe(updateUser.user));
      dispatch(openNotification('Profile updated!'));
    }
  };

  const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: UpdateUserFormValues,
    actions: FormikActions<UpdateUserFormValues>
  ): Promise<void> => {
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

    actions.setSubmitting(false);
  };

  const initialValues = {
    id: user.id || '',
    title: user.title || '',
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    general: ''
  };

  return (
    <Layout title="Edit Profile" backUrl="/profile">
      <StyledCard>
        <CardHeader title="Edit Profile" />
        <SlimCardContent>
          <Formik
            component={EditProfileForm}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          />
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withRedux, withApollo, withTranslation('common'))(EditProfilePage);
