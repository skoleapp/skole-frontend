import { Avatar, FormControl, Grid, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import { FormLayout, FormSubmitSection, PasswordField, TextFormField, TextLink } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { LoginMutation, useLoginMutation, UserObjectType } from 'generated';
import { useForm, useLanguageHeaderContext, useLanguageSelector } from 'hooks';
import { loadNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Router from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { mediaUrl, urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    avatar: {
        width: '5rem',
        height: '5rem',
        marginBottom: spacing(4),
        [breakpoints.up('md')]: {
            width: '7rem',
            height: '7rem',
        },
    },
    link: {
        textAlign: 'center',
        marginTop: spacing(4),
    },
}));

interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

const LoginPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();
    const { toggleNotification } = useNotificationsContext();
    const [existingUser, setExistingUser] = useState<UserObjectType | null>(null);
    const validExistingUser = !!R.propOr(false, 'username', existingUser) && !!R.propOr(false, 'email', existingUser);
    const context = useLanguageHeaderContext();
    const { formRef, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<LoginFormValues>();

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
            } else if (!!login.successMessage) {
                try {
                    resetForm();
                    toggleNotification(login.successMessage);
                    const nextUrl = !!query.next ? String(query.next) : urls.home;
                    await Router.push(nextUrl);
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

    const [loginMutation] = useLoginMutation({ onCompleted, onError, context });

    const handleSubmit = async (values: LoginFormValues): Promise<void> => {
        const { usernameOrEmail: _usernameOrEmail, password } = values;
        const usernameOrEmail: string = R.propOr(_usernameOrEmail, 'email', existingUser);

        await loginMutation({
            variables: { usernameOrEmail, password },
        });
    };

    const handleLoginWithDifferentCredentials = (): void => {
        localStorage.removeItem('user');
        setExistingUser(null);
        resetForm();
    };

    const renderExistingUserGreeting = (
        <Grid container alignItems="center" direction="column">
            <Avatar className={classes.avatar} src={mediaUrl(R.propOr('', 'avatar', existingUser))} />
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
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={formRef}>
            {validExistingUser ? renderExistingUserForm : renderNewUserForm}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('login:title'),
            description: t('login:description'),
        },
        header: t('login:header'),
        disableBottomNavbar: true,
        topNavbarProps: {
            dynamicBackUrl: true,
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    return <FormLayout {...layoutProps}>{renderForm}</FormLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['login'], locale),
    },
});

export default withNoAuth(LoginPage);
