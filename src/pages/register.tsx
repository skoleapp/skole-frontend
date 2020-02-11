import { Box, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { RegisterMutation, useRegisterMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection, StyledForm, FilledLogo } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePublicPage } from '../utils';
import { useRouter } from 'next/router';
import styled from 'styled-components';

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
}

const getBetaPassCodeFromQuery = (): string => {
    const router = useRouter();
    if (!!router.query && !!router.query.code) {
        return router.query.code.toString();
    } else {
        return '';
    }
};

const RegisterPage: I18nPage = () => {
    const client = useApolloClient();
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<RegisterFormValues>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const betaPassCode = getBetaPassCodeFromQuery();

    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        general: '',
        code: betaPassCode,
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:usernameRequired')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:emailRequired')),
        password: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:passwordRequired')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:confirmPasswordRequired')),
        code: Yup.string().required(t('validation:betaCodeRequired')),
    });

    const onCompleted = ({ register, login }: RegisterMutation): void => {
        if (register && register.errors) {
            handleMutationErrors(register.errors);
        } else if (login && login.errors) {
            handleMutationErrors(login.errors);
        } else if (login && login.user) {
            resetForm();
            dispatch(authenticate(client, login));
            Router.push(`/users/${login.user.id}`);
        }
    };

    const [registerMutation] = useRegisterMutation({ onCompleted, onError });

    const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
        const { username, email, password, code } = values;
        console.log(code);
        await registerMutation({ variables: { username, email, password } });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <FilledLogo />
                    <Typography variant="h2">{t('register:welcomeToBeta')}</Typography>
                    <Field
                        placeholder={t('forms:username')}
                        name="username"
                        component={TextField}
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        type="text"
                    />
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        variant="outlined"
                        autoComplete="new-password"
                        type="password"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                    />
                    <StyledField
                        placeholder={t('forms:betaCode')}
                        name="code"
                        autoComplete="off"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        label={t('forms:betaCode')}
                        disabled={!!betaPassCode}
                    />
                    <FormControl fullWidth>
                        <Typography variant="body2" color="textSecondary">
                            {t('register:termsHelpText')}{' '}
                            <Link href="/terms" target="_blank">
                                {t('common:terms')}
                            </Link>
                            .
                        </Typography>
                    </FormControl>
                    <FormSubmitSection submitButtonText={t('common:register')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink href="/login" variant="outlined" color="primary" fullWidth>
                        {t('register:alreadyHaveABetaAccount')}
                    </ButtonLink>
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('common:register')} renderCardContent={renderCardContent} backUrl />;
};

const StyledField = styled(Field)`
    .MuiInputBase-root.Mui-disabled {
        color: green;
    }
`;

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['register']) };
};

export default compose(withApollo, withRedux)(RegisterPage);
