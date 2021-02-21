import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useNotificationsContext } from 'context';
import { CreateEmailSubscriptionMutation, useCreateEmailSubscriptionMutation } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import useTranslation from 'next-translate/useTranslation';
import React, { SyntheticEvent, useState } from 'react';
import { BORDER_RADIUS } from 'styles';

const useStyles = makeStyles(({ palette, spacing }) => ({
  emailForm: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '20rem',
  },
  emailInputHeader: {
    marginBottom: spacing(4),
  },
  emailInputBox: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: palette.background.default,
    border: `0.05rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
    borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
    padding: spacing(3),
  },
  emailInputSubmitButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
  emailSubmittedText: {
    marginTop: spacing(16),
  },
}));

export const EmailSubscription: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onError = () => {
    toggleUnexpectedErrorNotification();
    setSubmitting(false);
  };

  const onCompleted = ({ createEmailSubscription }: CreateEmailSubscriptionMutation): void => {
    if (createEmailSubscription?.errors?.length) {
      onError();
    } else {
      setSubmitting(false);
      setEmailSubmitted(true);
    }
  };

  const [createEmailSubscription] = useCreateEmailSubscriptionMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmitEmail = async (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const variables = {
      email,
    };

    await createEmailSubscription({ variables });
  };

  const renderEmailInputHeader = (
    <Typography className={classes.emailInputHeader} variant="subtitle1" align="center">
      {t('common:emailSubscriptionHeader')}
    </Typography>
  );

  const renderEmailInput = (
    <form className={classes.emailForm} onSubmit={handleSubmitEmail}>
      <Box className={classes.emailInputBox}>
        <InputBase
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder={t('forms:yourEmail')}
        />
      </Box>
      <Button
        className={classes.emailInputSubmitButton}
        disabled={submitting}
        type="submit"
        variant="contained"
      >
        <ArrowForwardOutlined />
      </Button>
    </form>
  );

  const renderEmailInputContent = (
    <>
      {renderEmailInputHeader}
      {renderEmailInput}
    </>
  );

  const renderEmailSubmittedText = (
    <Typography className={classes.emailSubmittedText} variant="subtitle1" align="center">
      {t('common:emailSubscriptionSubmitted')}
    </Typography>
  );

  return emailSubmitted ? renderEmailSubmittedText : renderEmailInputContent;
};
