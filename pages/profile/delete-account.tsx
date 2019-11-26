import {
  Button,
  CardContent,
  CardHeader,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { logout, openNotification } from '../../actions';
import { DeleteAccountForm, Layout, StyledCard, StyledDialog } from '../../components';
import { useDeleteAccountMutation } from '../../generated/graphql';
import { DeleteAccountFormValues, FormCompleted, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePrivatePage } from '../../utils';

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

export const DeleteAccountPage: NextPage = () => {
  const [dialog, setDialog] = useState(initialDialogState);
  const { ref, setSubmitting, resetForm, onError } = useForm();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();

  const onCompleted = ({ deleteUser }: FormCompleted) => {
    if (deleteUser.errors) {
      onError(deleteUser.errors);
    } else {
      resetForm();
      openNotification('Account deleted successfully!');
      dispatch(logout(apolloClient));
    }
  };

  const [deleteAccountMutation] = useDeleteAccountMutation({ onCompleted, onError });

  const handleSubmit = (values: DeleteAccountFormValues) => {
    setSubmitting(false);
    setDialog({ password: values.password, open: true });
  };

  const handleClose = () => setDialog({ ...dialog, open: false });

  const handleSubmitConfirm = async () => {
    handleClose();
    setSubmitting(true);
    const { password } = dialog;
    await deleteAccountMutation({ variables: { password } });
    setSubmitting(false);
  };

  return (
    <Layout title="Delete Account" backUrl="/settings">
      <StyledCard>
        <CardHeader title="Delete Account" />
        <CardContent>
          <Formik
            component={DeleteAccountForm}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
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
    </Layout>
  );
};

DeleteAccountPage.getInitialProps = async (ctx: SkoleContext) => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withRedux, withApollo)(DeleteAccountPage);
