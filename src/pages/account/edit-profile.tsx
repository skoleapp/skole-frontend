import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import * as Yup from 'yup';

import { UpdateUserMutation, UserObjectType, useUpdateUserMutation } from '../../../generated/graphql';
import { AvatarField, FormSubmitSection, NotFoundLayout, SettingsLayout } from '../../components';
import { useAuthContext, useNotificationsContext } from '../../context';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withAuthSync } from '../../lib';
import { I18nProps } from '../../types';
import { useForm } from '../../utils';

export interface UpdateProfileFormValues {
    username: string;
    email: string;
    title: string;
    bio: string;
    avatar: string;
}

const EditProfilePage: NextPage<I18nProps> = () => {
    const { user, setUser } = useAuthContext();
    const { ref, handleMutationErrors, onError, setSubmitting } = useForm<UpdateProfileFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (updateUser) {
            if (updateUser.errors) {
                handleMutationErrors(updateUser.errors);
            } else {
                toggleNotification(t('notifications:profileUpdated'));
                setUser(updateUser.user as UserObjectType);
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
        username: Yup.string().required(t('validation:required')),
        email: Yup.string().email(t('validation:invalidEmail')),
        bio: Yup.string(),
    });

    const renderCardContent = (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <AvatarField {...props} />
                    <Field
                        placeholder={t('forms:title')}
                        name="title"
                        component={TextField}
                        label={t('forms:title')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
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
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('edit-profile:title'),
            description: t('edit-profile:description'),
        },
        topNavbarProps: {
            header: t('edit-profile:header'),
            dynamicBackUrl: true,
        },
        renderCardContent: renderCardContent,
        desktopHeader: t('edit-profile:header'),
        formLayout: true,
    };

    if (!!user) {
        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['edit-profile', 'profile']),
    },
});

export default withAuthSync(EditProfilePage);
