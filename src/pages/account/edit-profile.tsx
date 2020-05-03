import { Box } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import {
    SchoolObjectType,
    SchoolsDocument,
    SubjectObjectType,
    SubjectsDocument,
    UpdateUserMutation,
    UserObjectType,
    useUpdateUserMutation,
} from '../../../generated/graphql';
import {
    AutoCompleteField,
    AvatarField,
    FormSubmitSection,
    NotFoundLayout,
    SettingsLayout,
    TextLink,
} from '../../components';
import { useAuthContext, useNotificationsContext } from '../../context';
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
    school: SchoolObjectType | null;
    subject: SubjectObjectType | null;
}

const EditProfilePage: NextPage<I18nProps> = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuthContext();
    const verified = R.propOr(null, 'verified', user);
    const { ref, handleMutationErrors, onError, setSubmitting, unexpectedError } = useForm<UpdateProfileFormValues>();
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors) {
                handleMutationErrors(updateUser.errors);
            } else if (!!updateUser.message) {
                toggleNotification(updateUser.message);
                setUser(updateUser.user as UserObjectType);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError });

    const handleSubmit = async (values: UpdateProfileFormValues): Promise<void> => {
        const { username, email, title, bio, avatar, school, subject } = values;

        await updateUserMutation({
            variables: {
                username,
                email,
                title,
                bio,
                avatar,
                school: R.propOr('', 'id', school),
                subject: R.propOr('', 'id', subject),
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
        school: R.propOr(null, 'school', user) as SchoolObjectType,
        subject: R.propOr(null, 'subject', user) as SubjectObjectType,
        general: '',
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string(),
        username: Yup.string().required(t('validation:required')),
        email: Yup.string().email(t('validation:invalidEmail')),
        bio: Yup.string(),
        school: Yup.object().nullable(),
        subject: Yup.object().nullable(),
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
                        rows="4"
                        multiline
                        fullWidth
                    />
                    <Field
                        name="school"
                        label={t('forms:school')}
                        placeholder={t('forms:school')}
                        dataKey="schools"
                        document={SchoolsDocument}
                        component={AutoCompleteField}
                        variant="outlined"
                        helperText={t('forms:schoolHelpText')}
                        fullWidth
                    />
                    <Field
                        name="subject"
                        label={t('forms:subject')}
                        placeholder={t('forms:subject')}
                        dataKey="subjects"
                        document={SubjectsDocument}
                        component={AutoCompleteField}
                        variant="outlined"
                        helperText={t('forms:subjectHelpText')}
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
                    {verified === false && (
                        <Box marginTop="1rem" marginBottom="0.5rem">
                            <TextLink href="/account/verify-account" color="primary">
                                {t('common:verifyAccount')}
                            </TextLink>
                        </Box>
                    )}
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
        renderCardContent,
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
