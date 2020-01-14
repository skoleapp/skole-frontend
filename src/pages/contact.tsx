import * as Yup from 'yup';

import { Field, Formik } from 'formik';
import { FormSubmitSection, SelectField, StyledForm } from '../components';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useForm, useSettingsLayout } from '../utils';
import { withApollo, withRedux } from '../lib';

import { MenuItem } from '@material-ui/core';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const initialValues = {
    contactType: '',
    email: '',
    message: '',
    general: '',
};

export interface ContactFormValues {
    contactType: string;
    email: string;
    message: string;
}

const ContactPage: I18nPage = () => {
    const dispatch = useDispatch();
    const { ref, resetForm } = useForm<ContactFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        contactType: Yup.string().required(t('validation:contactTypeRequired')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:emailRequired')),
        message: Yup.string().required(t('validation:messageRequired')),
    });

    // TODO: Finish this.
    const handleSubmit = (values: ContactFormValues): void => {
        console.log(values);
        resetForm();
        dispatch(openNotification(t('notifications:messageSubmitted')));
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field name="contactType" label={t('forms:contactType')} component={SelectField} fullWidth>
                        <MenuItem value="feedback">{t('forms:feedback')}</MenuItem>
                        <MenuItem value="requestSchool">{t('forms:requestSchool')}</MenuItem>
                        <MenuItem value="requestSubject">{t('forms:requestSubject')}</MenuItem>
                        <MenuItem value="businessInquiry">{t('forms:businessInquiry')}</MenuItem>
                    </Field>
                    <Field
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        placeholder={t('forms:email')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        name="message"
                        component={TextField}
                        placeholder={t('forms:message')}
                        label={t('forms:message')}
                        variant="outlined"
                        fullWidth
                        multiline
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    const responsiveSettingsProps = {
        title: t('contact:title'),
        renderCardContent,
    };

    return useSettingsLayout(responsiveSettingsProps);
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['contact']) };
};

export default compose(withApollo, withRedux)(ContactPage);
