import { Avatar, Box, FormControl, Grid, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import {
    FormLayout,
    FormSubmitSection,
    LoadingLayout,
    OfflineLayout,
    PasswordField,
    TextFormField,
    TextLink,
} from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
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

const useStyles = makeStyles(({ spacing }) => ({
    avatarContainer: {
        padding: spacing(4),
    },
    link: {
        textAlign: 'center',
    },
}));

interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

const LoginPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
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
            if (!!login.errors && !!login.errors.length) {
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
        <Grid container alignItems="center" direction="column">
            <Box className={classes.avatarContainer}>
                <Avatar className="main-avatar" src={mediaURL(R.propOr('', 'avatar', existingUser))} />
            </Box>
            <Typography variant="subtitle1" gutterBottom>
                {t('login:existingUserGreeting', { username: R.propOr('-', 'username', existingUser) })}
            </Typography>
        </Grid>
    );

    const renderUsernameOrEmailField = !validExistingUser && (
        <Field name="usernameOrEmail" component={TextFormField} label={t('forms:usernameOrEmail')} />
    );

    const renderPasswordField = (props: FormikProps<LoginFormValues>): JSX.Element => <PasswordField {...props} />;

    const renderFormSubmitSection = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:login')} {...props} />
    );

    const renderRegisterLink = (
        <FormControl className={classes.link}>
            <TextLink href={urls.register}>{t('common:register')}</TextLink>
        </FormControl>
    );

    const renderForgotPasswordLink = (
        <FormControl className={classes.link}>
            <TextLink href={urls.resetPassword}>{t('login:forgotPassword')}</TextLink>
        </FormControl>
    );

    const renderLoginWithDifferentCredentialsLink = (
        <FormControl className={classes.link}>
            <MuiLink onClick={handleLoginWithDifferentCredentials}>{t('login:loginWithDifferentCredentials')}</MuiLink>
        </FormControl>
    );

    const renderExistingUserForm = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <Form>
            {renderExistingUserGreeting}
            {renderUsernameOrEmailField}
            {renderPasswordField(props)}
            {renderFormSubmitSection(props)}
            {renderForgotPasswordLink}
            {renderLoginWithDifferentCredentialsLink}
        </Form>
    );

    const renderNewUserForm = (props: FormikProps<LoginFormValues>): JSX.Element => (
        <Form>
            {renderUsernameOrEmailField}
            {renderPasswordField(props)}
            {renderFormSubmitSection(props)}
            {renderRegisterLink}
            {renderForgotPasswordLink}
        </Form>
    );

    const renderForm = (
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
        header: t('login:header'),
        disableBottomNavbar: true,
        topNavbarProps: {
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <FormLayout {...layoutProps}>{renderForm}</FormLayout>;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['login']),
    },
});

export default withNoAuth(LoginPage);
