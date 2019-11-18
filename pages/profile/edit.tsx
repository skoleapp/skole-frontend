import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification, updateUserMe } from '../../actions';
import { StyledCard } from '../../components';
import { EditProfileForm, Layout } from '../../containers';
import { useUpdateUserMutation } from '../../generated/graphql';
import { SkoleContext, State, UpdateUserFormValues } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { createFormErrors, usePrivatePage } from '../../utils';

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  username: Yup.string().required('Username is required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  bio: Yup.string(),
  language: Yup.string().oneOf(['English', 'Finnish', 'Swedish'], 'Invalid language.')
});

const EditProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCompleted = ({ updateUser }: any): void => {
    if (updateUser.errors) {
      return onError(updateUser.errors);
    } else {
      dispatch(updateUserMe(updateUser.user));
      dispatch(openNotification('Profile updated!'));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: UpdateUserFormValues,
    actions: FormikActions<UpdateUserFormValues>
  ): Promise<void> => {
    const { username, email, title, bio, avatar, language } = values;

    await updateUserMutation({
      variables: {
        username,
        email,
        title,
        bio,
        avatar,
        language: language.toUpperCase()
      }
    });

    actions.setSubmitting(false);
  };

  const { id, title, username, email, bio, avatar, language, points } = user;

  const initialValues = {
    id: id || '',
    title: title || '',
    username: username || '',
    email: email || '',
    bio: bio || '',
    avatar: avatar || '',
    language: language || '',
    points: points || 0,
    general: ''
  };

  return (
    <Layout title="Edit Profile" backUrl="/profile">
      <StyledCard>
        <Formik
          component={EditProfileForm}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          ref={ref}
        />
      </StyledCard>
    </Layout>
  );
};

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(EditProfilePage);
