import { Button, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import Router from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FeedbackFormValues, FeedbackType } from '../../interfaces';
import { Card } from '../atoms';
import { FeedbackButtonSection, FeedbackForm } from '../molecules';

const initialValues = {
  comment: ''
};

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Please tell us some details about your feedback.')
});

export const FeedbackCard: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rate, setRate] = useState<FeedbackType>('');

  const onSubmit = async (values: FeedbackFormValues): Promise<void> => {
    console.log({ ...values, rate });
    setSubmitted(true);
  };

  return (
    <StyledFeedbackCard>
      {!submitted ? (
        <>
          <Typography variant="h5">Leave feedback</Typography>
          <FeedbackButtonSection setRate={setRate} />
          <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            component={FeedbackForm}
          />
        </>
      ) : (
        <>
          <Typography variant="h5">Thank you for your feedback!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={(): Promise<boolean> => Router.push('/')}
            className="back-to-home-button"
          >
            back to home
          </Button>
        </>
      )}
    </StyledFeedbackCard>
  );
};

const StyledFeedbackCard = styled(Card)`
  .back-to-home-button {
    margin-top: 1rem;
  }
`;
