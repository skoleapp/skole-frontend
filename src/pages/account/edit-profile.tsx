import { Box, FormControl, FormHelperText } from '@material-ui/core';
import {
    AutoCompleteField,
    AvatarField,
    ButtonLink,
    FormSubmitSection,
    LoadingLayout,
    NotFoundLayout,
    OfflineLayout,
    SettingsLayout,
    TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import {
    SchoolObjectType,
    SchoolsDocument,
    SubjectObjectType,
    SubjectsDocument,
    UpdateUserMutation,
    UserObjectType,
    useUpdateUserMutation,
} from 'generated';
import { useForm } from 'hooks';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { AuthProps, UpdateProfileFormValues } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

const EditProfilePage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();
    const { userMe, setUserMe, verified } = useAuthContext();
    const { ref, handleMutationErrors, onError, setSubmitting, unexpectedError } = useForm<UpdateProfileFormValues>();
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors) {
                handleMutationErrors(updateUser.errors);
            } else if (!!updateUser.message) {
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

        setSubmitting(false);
    };

    const initialValues = {
        id: R.propOr('', 'id', userMe) as string,
        title: R.propOr('', 'title', userMe) as string,
        username: R.propOr('', 'username', userMe) as string,
        email: R.propOr('', 'email', userMe) as string,
        bio: R.propOr('', 'bio', userMe) as string,
        avatar: R.propOr('', 'avatar', userMe) as string,
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

    const renderTitleField = (
        <Field
            placeholder={t('forms:title')}
            name="title"
            component={TextField}
            label={t('forms:title')}
            variant="outlined"
            fullWidth
            autoComplete="off"
        />
    );

    const renderUsernameField = (
        <Field
            placeholder={t('forms:username')}
            name="username"
            component={TextField}
            label={t('forms:username')}
            variant="outlined"
            fullWidth
            autoComplete="off"
        />
    );

    const renderEmailField = (
        <Field
            placeholder={t('forms:email')}
            name="email"
            component={TextField}
            label={t('forms:email')}
            variant="outlined"
            fullWidth
            autoComplete="off" // FIXE: This seems to have no effect.
        />
    );

    const renderBioField = (
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
    );

    const renderSchoolField = (
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
    );

    const renderSubjectField = (
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
    );

    const renderMarketingPermissionField = (
        <FormControl fullWidth>
            <FormHelperText>{t('forms:marketingPermission')}</FormHelperText>
            <Field name="marketingPermission" component={Switch} fullWidth disabled color="primary" />
        </FormControl>
    );

    const renderPushNotificationsField = (
        <FormControl fullWidth>
            <FormHelperText>{t('forms:pushNotifications')}</FormHelperText>
            <Field name="pushNotifications" component={Switch} fullWidth disabled color="primary" />
        </FormControl>
    );

    const renderFormSubmitSection = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    );

    const renderBackToProfileButton = (
        <FormControl fullWidth>
            <ButtonLink href={urls.user} as={`/users/${R.propOr('', 'id', userMe)}`} color="primary" fullWidth>
                {t('edit-profile:backToProfile')}
            </ButtonLink>
        </FormControl>
    );

    const renderVerifyAccountLink = verified === false && (
        <Box marginTop="1rem" marginBottom="0.5rem">
            <TextLink href={urls.verifyAccount} color="primary">
                {t('common:verifyAccount')}
            </TextLink>
        </Box>
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} ref={ref}>
            {renderEditProfileFormContent}
        </Formik>
    );

    const seoProps = {
        title: t('edit-profile:title'),
        description: t('edit-profile:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('edit-profile:header'),
            dynamicBackUrl: true,
        },
        renderCardContent: renderEditProfileForm,
        desktopHeader: t('edit-profile:header'),
        formLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    if (!!userMe) {
        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

export default withAuth(EditProfilePage);
