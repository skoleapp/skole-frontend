import { FormControl, FormHelperText, Switch } from '@material-ui/core';
import {
    AutocompleteField,
    AvatarField,
    ButtonLink,
    FormSubmitSection,
    NotFoundLayout,
    SettingsLayout,
    TextFormField,
    TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
    AutocompleteSchoolsDocument,
    AutocompleteSubjectsDocument,
    SchoolObjectType,
    SubjectObjectType,
    UpdateUserMutation,
    UserObjectType,
    useUpdateUserMutation,
} from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { UpdateProfileFormValues } from 'types';
import { mediaURL, urls } from 'utils';
import * as Yup from 'yup';

const EditProfilePage: NextPage = () => {
    const { t } = useTranslation();
    const { userMe, setUserMe, verified } = useAuthContext();
    const { formRef, handleMutationErrors, onError, resetForm, unexpectedError } = useForm<UpdateProfileFormValues>();
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors && !!updateUser.errors.length) {
                handleMutationErrors(updateUser.errors);
            } else if (!!updateUser.message) {
                resetForm();
                toggleNotification(updateUser.message);
                setUserMe(updateUser.user as UserObjectType);
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
    };

    const initialValues = {
        id: R.propOr('', 'id', userMe) as string,
        title: R.propOr('', 'title', userMe) as string,
        username: R.propOr('', 'username', userMe) as string,
        email: R.propOr('', 'email', userMe) as string,
        bio: R.propOr('', 'bio', userMe) as string,
        avatar: mediaURL(R.propOr('', 'avatar', userMe) as string),
        school: R.propOr(null, 'school', userMe) as SchoolObjectType,
        subject: R.propOr(null, 'subject', userMe) as SubjectObjectType,
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

    const renderAvatarField = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => <AvatarField {...props} />;
    const renderTitleField = <Field name="title" component={TextFormField} label={t('forms:title')} />;
    const renderUsernameField = <Field name="username" component={TextFormField} label={t('forms:username')} />;
    const renderEmailField = <Field name="email" component={TextFormField} label={t('forms:email')} />;
    const renderBioField = <Field name="bio" component={TextFormField} label={t('forms:bio')} rows="4" multiline />;

    const renderSchoolField = (
        <Field
            name="school"
            label={t('forms:schoolOptional')}
            dataKey="autocompleteSchools"
            searchKey="name"
            document={AutocompleteSchoolsDocument}
            component={AutocompleteField}
            helperText={t('forms:schoolHelpText')}
        />
    );

    const renderSubjectField = (
        <Field
            name="subject"
            label={t('forms:subjectOptional')}
            dataKey="autocompleteSubjects"
            searchKey="name"
            document={AutocompleteSubjectsDocument}
            component={AutocompleteField}
            helperText={t('forms:subjectHelpText')}
        />
    );

    const renderMarketingPermissionField = (
        <FormControl>
            <FormHelperText>{t('forms:marketingPermission')}</FormHelperText>
            <Field name="marketingPermission" component={Switch} fullWidth disabled color="primary" />
        </FormControl>
    );

    const renderPushNotificationsField = (
        <FormControl>
            <FormHelperText>{t('forms:pushNotifications')}</FormHelperText>
            <Field name="pushNotifications" component={Switch} fullWidth disabled color="primary" />
        </FormControl>
    );

    const renderFormSubmitSection = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    );

    const renderBackToProfileButton = (
        <FormControl>
            <ButtonLink href={urls.user} as={`/users/${R.propOr('', 'id', userMe)}`} color="primary" fullWidth>
                {t('edit-profile:backToProfile')}
            </ButtonLink>
        </FormControl>
    );

    const renderVerifyAccountLink = verified === false && (
        <FormControl className="text-center">
            <TextLink href={urls.verifyAccount} color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </FormControl>
    );

    const renderEditProfileFormContent = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
        <Form>
            {renderAvatarField(props)}
            {renderTitleField}
            {renderUsernameField}
            {renderEmailField}
            {renderBioField}
            {renderSchoolField}
            {renderSubjectField}
            {renderMarketingPermissionField}
            {renderPushNotificationsField}
            {renderFormSubmitSection(props)}
            {renderBackToProfileButton}
            {renderVerifyAccountLink}
        </Form>
    );

    const renderEditProfileForm = (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={formRef}>
            {renderEditProfileFormContent}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('edit-profile:title'),
            description: t('edit-profile:description'),
        },
        header: t('edit-profile:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (!!userMe) {
        return <SettingsLayout {...layoutProps}>{renderEditProfileForm}</SettingsLayout>;
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['edit-profile']),
    },
});

export default withAuth(EditProfilePage);
