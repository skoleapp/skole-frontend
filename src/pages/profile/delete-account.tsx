import {
  Button,
  CardHeader,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { useDeleteAccountMutation } from '../../../generated/graphql';
import { deAuthenticate } from '../../actions';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledDialog,
  StyledForm
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import {
  DeleteAccountFormValues,
  FormCompleted,
  I18nPage,
  I18nProps,
  SkoleContext
} from '../../types';
import { useForm, usePrivatePage } from '../../utils';

const initialValues = {
  password: '',
  general: ''
};

const initialDialogState = {
  password: '',
  open: false
};

export const DeleteAccountPage: I18nPage = () => {
  const [dialog, setDialog] = useState(initialDialogState);
  const { ref, setSubmitting, resetForm, onError } = useForm();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const { t } = useTranslation();

  const onCompleted = ({ deleteUser }: FormCompleted): void => {
    if (deleteUser.errors) {
      onError(deleteUser.errors);
    } else {
      resetForm();
      dispatch(deAuthenticate(apolloClient));
    }
  };

  const [deleteAccountMutation] = useDeleteAccountMutation({ onCompleted, onError });

  const handleSubmit = (values: DeleteAccountFormValues): void => {
    setSubmitting(false);
    setDialog({ password: values.password, open: true });
  };

  const handleClose = (): void => setDialog({ ...dialog, open: false });

  const handleSubmitConfirm = async (): Promise<void> => {
    handleClose();
    setSubmitting(true);
    const { password } = dialog;
    await deleteAccountMutation({ variables: { password } });
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(t('validation:passwordRequired'))
  });

  const renderForm = (props: FormikProps<DeleteAccountFormValues>) => (
    <StyledForm>
      <Field
        name="password"
        label={t('forms:password')}
        placeholder={t('forms:password')}
        component={TextField}
        fullWidth
        type="password"
      />
      <FormSubmitSection submitButtonText={t('delete-account:submitButton')} {...props} />
    </StyledForm>
  );

  const renderCard = (
    <StyledCard>
      <CardHeader title={t('delete-account:title')} />
      <SlimCardContent>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          ref={ref}
        >
          {renderForm}
        </Formik>
      </SlimCardContent>
    </StyledCard>
  );

  const renderDialog = (
    <StyledDialog open={dialog.open} onClose={handleClose}>
      <DialogTitle>{t('delete-account:dialogTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('delete-account:dialogContentText')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          {t('common:cancel')}
        </Button>
        <Button onClick={handleSubmitConfirm} variant="contained" color="primary">
          {t('common:confirm')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );

  return (
    <Layout title={t('delete-account:title')} backUrl>
      {renderCard}
      {renderDialog}
    </Layout>
  );
};

DeleteAccountPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePrivatePage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['delete-account'])
  };
};

export default compose(withApollo, withRedux)(DeleteAccountPage);
