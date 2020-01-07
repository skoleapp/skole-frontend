import * as R from 'ramda';
import * as Yup from 'yup';

import { CardHeader, FormControl } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import {
    FormSubmitSection,
    ImagePreviewField,
    Layout,
    SlimCardContent,
    StyledCard,
    StyledForm,
} from '../../components';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { UpdateUserMutation, UserType, useUpdateUserMutation } from '../../../generated/graphql';
import { openNotification, reAuthenticate } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, usePrivatePage } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useTranslation } from 'react-i18next';

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
                dispatch(openNotification(t('notifications:profileUpdated')));
                dispatch(reAuthenticate(updateUser.user as UserType));
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

    const renderForm = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
        <StyledForm>
            <FormControl fullWidth>
                <Field name="avatar" label={t('edit-profile:changeAvatarButton')} component={ImagePreviewField} />
            </FormControl>
            <FormControl fullWidth>
                <Field
                    placeholder={t('forms:title')}
                    name="title"
                    component={TextField}
                    label={t('forms:title')}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
                <Field
                    placeholder={t('forms:username')}
                    name="username"
                    component={TextField}
                    label={t('forms:username')}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
                <Field
                    placeholder={t('forms:email')}
                    name="email"
                    component={TextField}
                    label={t('forms:email')}
                    variant="outlined"
                    fullWidth
                />
            </FormControl>
            <FormControl fullWidth>
                <Field
                    placeholder={t('forms:bio')}
                    name="bio"
                    component={TextField}
                    label={t('forms:bio')}
                    variant="outlined"
                    multiline
                    fullWidth
                />
            </FormControl>
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
    return { namespacesRequired: includeDefaultNamespaces(['edit-profile']) };
};

export default compose(withApollo, withRedux)(EditProfilePage);
