import { FormControl, FormHelperText, makeStyles, Switch } from '@material-ui/core';
import {
    AutocompleteField,
    AvatarField,
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
import { withAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { UpdateProfileFormValues } from 'types';
import { mediaUrl, urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing }) => ({
    link: {
        textAlign: 'center',
        marginTop: spacing(4),
    },
}));

const EditProfilePage: NextPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const context = useLanguageHeaderContext();
    const { userMe, setUserMe, verified } = useAuthContext();
    const { formRef, handleMutationErrors, onError, resetForm, unexpectedError } = useForm<UpdateProfileFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const id: string = R.propOr('', 'id', userMe);
    const title: string = R.propOr('', 'title', userMe);
    const username: string = R.propOr('', 'username', userMe);
    const email: string = R.propOr('', 'email', userMe);
    const bio: string = R.propOr('', 'bio', userMe);
    const avatar: string = R.propOr('', 'avatar', userMe);
    const school: SchoolObjectType = R.propOr(null, 'school', userMe);
    const subject: SubjectObjectType = R.propOr(null, 'subject', userMe);

    const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
        if (!!updateUser) {
            if (!!updateUser.errors && !!updateUser.errors.length) {
                handleMutationErrors(updateUser.errors);
            } else if (!!updateUser.successMessage) {
                resetForm();
                toggleNotification(updateUser.successMessage);
                setUserMe(updateUser.user as UserObjectType);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [updateUserMutation] = useUpdateUserMutation({ onCompleted, onError, context });

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
        id,
        title,
        username,
        email,
        bio,
        avatar: mediaUrl(avatar),
        school,
        subject,
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

    const renderVerifyAccountLink = verified === false && (
        <FormControl className={classes.link}>
            <TextLink href={urls.verifyAccount}>{t('common:verifyAccount')}</TextLink>
        </FormControl>
    );

    const renderBackToProfileLink = (
        <FormControl className={classes.link}>
            <TextLink href={urls.user(R.propOr('', 'id', userMe))}>{t('edit-profile:backToProfile')}</TextLink>
        </FormControl>
    );

    const renderDeleteProfileLink = (
        <FormControl className={classes.link}>
            <TextLink href={urls.deleteAccount}>{t('common:deleteAccount')}</TextLink>
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
            {renderVerifyAccountLink}
            {renderBackToProfileLink}
            {renderDeleteProfileLink}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['edit-profile'], locale),
    },
});

export default withAuth(EditProfilePage);
