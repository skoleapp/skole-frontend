import { Box, Divider } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from '../i18n';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { SignInMutation, useSignInMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection, StyledForm, TextLink } from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAlerts, useForm, usePublicPage } from '../utils';

const initialValues = {
    usernameOrEmail: '',
    password: '',
    general: '',
};

export interface SignInFormValues {
    usernameOrEmail: string;
    password: string;
}

const SignInPage: I18nPage = () => {
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<SignInFormValues>();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:usernameOrEmailRequired')),
        password: Yup.string().required(t('validation:passwordRequired')),
    });

    const onCompleted = async ({ signIn }: SignInMutation): Promise<void> => {
        if (signIn) {
            if (signIn.errors) {
                handleMutationErrors(signIn.errors);
            } else {
                resetForm();
                await dispatch(authenticate(client, signIn));

                const { next } = query;
                const { user } = signIn;

                if (!!next) {
                    Router.push(next as string);
                } else if (user) {
                    Router.push(`/users/${user.id}`);
                }
            }
        }
    };

    const [signInMutation] = useSignInMutation({ onCompleted, onError });

    const handleSubmit = async (values: SignInFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;
        await signInMutation({ variables: { usernameOrEmail, password } });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        placeholder={t('forms:usernameOrEmail')}
                        name="usernameOrEmail"
                        component={TextField}
                        label={t('forms:usernameOrEmail')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        label={t('forms:password')}
                        variant="outlined"
                        type="password"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:signIn')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink href="/sign-up" variant="outlined" color="primary" fullWidth>
                        {t('sign-in:createAccount')}
                    </ButtonLink>
                    <Box marginTop="1rem">
                        <TextLink href="/reset-password">{t('sign-in:forgotPassword')}</TextLink>
                    </Box>
                </StyledForm>
            )}
        </Formik>
    );

    return (
        <FormLayout
            title={t('common:signIn')}
            renderCardContent={renderCardContent}
            renderAlert={!!query.next ? renderAlert('warning', t('alerts:signInRequired')) : undefined}
            backUrl
        />
    );
};

SignInPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['sign-in']) };
};

export default compose(withApollo, withRedux)(SignInPage);
