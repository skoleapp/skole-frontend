import { Avatar, Box, FormControl, InputAdornment, Link, Typography } from '@material-ui/core';
import { AccountCircleOutlined, LockOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout, FormSubmitSection, LoadingLayout, OfflineLayout, TextLink } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { LoginMutation, useLoginMutation, UserObjectType } from 'generated';
import { useForm, useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { AuthProps } from 'types';
import { mediaURL, redirect, urls } from 'utils';
import * as Yup from 'yup';

interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

const LoginPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();
    const { toggleNotification } = useNotificationsContext();
    const [existingUser, setExistingUser] = useState<UserObjectType | null>(null);
    const validExistingUser = !!R.propOr(false, 'username', existingUser) && !!R.propOr(false, 'email', existingUser);

    const { ref, setSubmitting, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<
        LoginFormValues
    >();

    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem('user') || 'null');
        setExistingUser(existingUser);
    }, []);

    const validationSchema = Yup.object().shape({
        usernameOrEmail: !validExistingUser ? Yup.string().required(t('validation:required')) : Yup.string(),
        password: Yup.string().required(t('validation:required')),
    });

    const initialValues = {
        usernameOrEmail: '',
        password: '',
        general: '',
    };

    const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
        if (!!login) {
            if (!!login.errors) {
                handleMutationErrors(login.errors);
            } else if (!!login.message) {
                const { next } = query;

                try {
                    resetForm();
                    toggleNotification(login.message);
                    await redirect((next as string) || urls.home);
                } catch {
                    unexpectedError();
                }
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [loginMutation] = useLoginMutation({ onCompleted, onError });

    const handleSubmit = async (values: LoginFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;

        await loginMutation({
            variables: { usernameOrEmail: R.propOr(usernameOrEmail, 'email', existingUser) as string, password },
        });

        setSubmitting(false);
    };

    const handleLoginWithDifferentCredentials = (): void => {
        localStorage.removeItem('user');
        setExistingUser(null);
        resetForm();
    };

    const renderExistingUserGreeting = (
        <Box display="flex" flexDirection="column" alignItems="center" marginTop="1rem">
            <Avatar className="main-avatar" src={mediaURL(R.propOr('', 'avatar', existingUser))} />
            <Box marginTop="2rem">
                <Typography variant="h3">
                    {t('login:existingUserGreeting', { username: R.propOr('-', 'username', existingUser) })}
                </Typography>
            </Box>
        </Box>
    );

    const renderUsernameOrEmailField = !validExistingUser && (
        <Field
            placeholder={t('forms:usernameOrEmail')}
            name="usernameOrEmail"
            component={TextField}
            label={t('forms:usernameOrEmail')}
            variant="outlined"
            fullWidth
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircleOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderPasswordField = (
        <Field
            placeholder={t('forms:password')}
            name="password"
            component={TextField}
            label={t('forms:password')}
            variant="outlined"
            type="password"
            fullWidth
            autoComplete="off"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockOutlined />
                    </InputAdornment>
                ),
            }}
        />
    );

    const renderFormSubmitSection = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:login')} {...props} />
    );

    const renderRegisterButton = (
        <FormControl fullWidth>
            <ButtonLink href={urls.register} color="primary" fullWidth>
                {t('common:register')}
            </ButtonLink>
        </FormControl>
    );

    const renderForgotPasswordLink = (
        <Box marginTop="1rem">
            <TextLink href={urls.resetPassword}>{t('login:forgotPassword')}</TextLink>
        </Box>
    );

    const renderLoginWithDifferentCredentialsLink = (
        <Box marginTop="1rem">
            <Link onClick={handleLoginWithDifferentCredentials}>{t('login:loginWithDifferentCredentials')}</Link>
        </Box>
    );

    const renderExistingUserForm = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <Form>
            {renderExistingUserGreeting}
            {renderUsernameOrEmailField}
            {renderPasswordField}
            {renderFormSubmitSection(props)}
            {renderForgotPasswordLink}
            {renderLoginWithDifferentCredentialsLink}
        </Form>
    );

    const renderNewUserForm = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <Form>
            {renderUsernameOrEmailField}
            {renderPasswordField}
            {renderFormSubmitSection(props)}
            {renderRegisterButton}
            {renderForgotPasswordLink}
        </Form>
    );

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {validExistingUser ? renderExistingUserForm : renderNewUserForm}
        </Formik>
    );

    const seoProps = {
        title: t('login:title'),
        description: t('login:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('login:header'),
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
        },
        desktopHeader: t('login:header'),
        renderCardContent,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <FormLayout {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['login']),
    },
});

export default withNoAuth(LoginPage);
