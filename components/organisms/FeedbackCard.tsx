import { Button, ButtonGroup, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { FeedbackFormValues, FeedbackType } from '../../interfaces';
import { Card } from '../containers';
import { FeedbackForm } from '../forms';

const initialValues = {
  comment: ''
};

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Please tell us some details about your feedback.')
});

export const FeedbackCard: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rate, setRate] = useState<FeedbackType>('');

  // TODO: Finish this.
  const onSubmit = async (values: FeedbackFormValues): Promise<void> => {
    console.log({ ...values, rate });
    setSubmitted(true);
  };

  return (
    <StyledFeedbackCard>
      {!submitted ? (
        <>
          <Typography variant="h5">Feedback</Typography>
          <ButtonGroup fullWidth aria-label="full width outlined button group">
            <Button value="Good" onClick={(): void => setRate('good')} color="primary">
              good
            </Button>
            <Button value="Neutral" onClick={(): void => setRate('neutral')} color="primary">
              neutral
            </Button>
            <Button value="Bad" onClick={(): void => setRate('bad')} color="primary">
              bad
            </Button>
          </ButtonGroup>
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
          <Link href="/">
            <Button variant="contained" color="primary">
              back to home
            </Button>
          </Link>
        </>
      )}
    </StyledFeedbackCard>
  );
};

const StyledFeedbackCard = styled(Card)`
  .MuiButtonGroup-root {
    button:focus {
      background-color: var(--primary);
      color: var(--white);
    }
  }
`;
