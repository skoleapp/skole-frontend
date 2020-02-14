import { MenuItem } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { toggleNotification } from '../actions';
import { FormSubmitSection, SelectField, SettingsLayout, StyledForm } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useForm } from '../utils';

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
        dispatch(toggleNotification(t('notifications:messageSubmitted')));
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
                        rows="5"
                        fullWidth
                        multiline
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    return <SettingsLayout title={t('contact:title')} renderCardContent={renderCardContent} backUrl />;
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['contact']) };
};

export default compose(withApollo, withRedux)(ContactPage);
