import { CardContent, CardHeader } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification, updateUserMe } from '../../actions';
import { EditProfileForm, Layout, StyledCard } from '../../components';
import { useUpdateUserMutation } from '../../generated/graphql';
import { SkoleContext, State, UpdateUserFormValues } from '../../interfaces';
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
  const { ref, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ updateUser }: any): void => {
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

  const { id, title, username, email, bio, avatar, points } = user;

  const initialValues = {
    id: id || '',
    title: title || '',
    username: username || '',
    email: email || '',
    bio: bio || '',
    avatar: avatar || '',
    points: points || 0,
    general: ''
  };

  return (
    <Layout title="Edit Profile" backUrl="/profile">
      <StyledCard>
        <CardHeader title="Edit Profile" />
        <CardContent>
          <Formik
            component={EditProfileForm}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(EditProfilePage);
