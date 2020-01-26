import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { UpdateUserMutation, UserObjectType, useUpdateUserMutation } from '../../../generated/graphql';
import { toggleNotification, reAuthenticate } from '../../actions';
import { FormSubmitSection, SettingsLayout, StyledForm, AvatarField } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { useForm, usePrivatePage } from '../../utils';

export interface UpdateProfileFormValues {
    username: string;
    email: string;
    title: string;
    bio: string;
    avatar: string;
}

const EditProfilePage: I18nPage = () => {
    const { user } = useSelector((state: State) => state.auth);
    const { ref, handleMutationErrors, onError, setSubmitting } = useForm<UpdateProfileFormValues>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (updateUser) {
            if (updateUser.errors) {
                handleMutationErrors(updateUser.errors);
            } else {
                dispatch(toggleNotification(t('notifications:profileUpdated')));
                dispatch(reAuthenticate(updateUser.user as UserObjectType));
            }
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
                avatar,
            },
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
        general: '',
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string(),
        username: Yup.string().required(t('validation:usernameRequired')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:emailRequired')),
        bio: Yup.string(),
    });

    const renderCardContent = (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <AvatarField {...props} />
                    <Field
                        placeholder={t('forms:title')}
                        name="title"
                        component={TextField}
                        label={t('forms:title')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:username')}
                        name="username"
                        component={TextField}
                        label={t('forms:username')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:bio')}
                        name="bio"
                        component={TextField}
                        label={t('forms:bio')}
                        variant="outlined"
                        rows="5"
                        multiline
                        rows="4"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    return <SettingsLayout title={t('edit-profile:title')} renderCardContent={renderCardContent} backUrl />;
};

EditProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['edit-profile']) };
};

export default compose(withApollo, withRedux)(EditProfilePage);
