import {
  Button,
  CardHeader,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { logout } from '../../actions';
import {
  DeleteAccountForm,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledDialog,
  StyledForm,
  FormSubmitSection
} from '../../components';
import { useDeleteAccountMutation } from '../../generated/graphql';
import { DeleteAccountFormValues, FormCompleted, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePrivatePage } from '../../utils';
import { withTranslation } from '../../i18n';

const initialValues = {
  password: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required.')
});

const initialDialogState = {
  password: '',
  open: false
};

export const DeleteAccountPage: NextPage = ({ t }: any) => {
  const [dialog, setDialog] = useState(initialDialogState);
  const { ref, setSubmitting, resetForm, onError } = useForm();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();

  const onCompleted = ({ deleteUser }: FormCompleted): void => {
    if (deleteUser.errors) {
      onError(deleteUser.errors);
    } else {
      resetForm();
      dispatch(logout(apolloClient));
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

  const renderCard = (
    <StyledCard>
      <CardHeader title={t('headerDeleteAccount')} />
      <SlimCardContent>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          ref={ref}
        >
          {props => (
            <StyledForm>
              <Field
                name="password"
                label={t('fieldPassword')}
                placeholder={t('fieldPassword')}
                component={TextField}
                fullWidth
                type="password"
              />
              <FormSubmitSection submitButtonText={t('buttonDeleteAccount')} {...props} />
            </StyledForm>
          )}
        </Formik>
      </SlimCardContent>
    </StyledCard>
  );

  const renderDialog = (
    <StyledDialog open={dialog.open} onClose={handleClose}>
      <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action cannot be reverted and your account will be lost forever!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          cancel
        </Button>
        <Button onClick={handleSubmitConfirm} variant="contained" color="primary">
          confirm
        </Button>
      </DialogActions>
    </StyledDialog>
  );

  return (
    <Layout t={t} title={t('titleDeleteAccount')} backUrl="/settings">
      {renderCard}
      {renderDialog}
    </Layout>
  );
};

DeleteAccountPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(DeleteAccountPage);
