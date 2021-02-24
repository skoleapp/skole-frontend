import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Form, Formik, FormikProps } from 'formik';
import { CreateEmailSubscriptionMutation, useCreateEmailSubscriptionMutation } from 'generated';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { EmailInputFormField } from '../form-fields/EmailInputFormField'; // Imported like this on purpose to avoid a circular import.
import { Emoji } from './Emoji';

const useStyles = makeStyles(({ spacing }) => ({
  form: {
    width: '100%',
    maxWidth: '25rem',
  },
  header: {
    marginBottom: spacing(4),
  },
}));

interface Props {
  header: string;
}

interface EmailSubscriptionFormValues {
  email: string;
}

export const EmailSubscription: React.FC<Props> = ({ header }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const { formRef, onError, handleMutationErrors } = useForm<EmailSubscriptionFormValues>();

  const onCompleted = ({ createEmailSubscription }: CreateEmailSubscriptionMutation): void => {
    if (createEmailSubscription?.errors?.length) {
      handleMutationErrors(createEmailSubscription.errors);
    } else {
      setEmailSubmitted(true);
    }
  };

  const [createEmailSubscription] = useCreateEmailSubscriptionMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({ email }: EmailSubscriptionFormValues) => {
    await createEmailSubscription({ variables: { email } });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')),
  });

  const initialValues = {
    email: '',
  };

  const renderHeader = (
    <Typography className={classes.header} variant="subtitle1" align="center">
      {header}
    </Typography>
  );

  const renderFormFields = (props: FormikProps<EmailSubscriptionFormValues>) => (
    <Form className={classes.form}>
      <EmailInputFormField {...props} />
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const renderEmailInputContent = (
    <Grid container direction="column" alignItems="center">
      {renderHeader}
      {renderForm}
    </Grid>
  );

  const renderEmailSubmittedText = (
    <Typography variant="subtitle1" align="center">
      {t('common:emailSubscriptionSubmitted')}
      <Emoji emoji="🎉" />
    </Typography>
  );

  return emailSubmitted ? renderEmailSubmittedText : renderEmailInputContent;
};
