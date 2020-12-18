import {
  Box,
  Button,
  DialogContent,
  FormHelperText,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
} from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';
import {
  ACCEPTED_ATTACHMENT_FILES,
  MAX_COMMENT_ATTACHMENT_FILE_SIZE,
  MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
  urls,
} from 'utils';
import * as R from 'ramda';
import imageCompression from 'browser-image-compression';
import {
  AttachFileOutlined,
  CameraAltOutlined,
  ClearOutlined,
  SendOutlined,
} from '@material-ui/icons';
import { DialogHeader, SkoleDialog, TextLink } from '../shared';
import { AuthorSelection } from './AuthorSelection';
import { TextFormField } from '../form-fields';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  textFieldInputProps: {
    borderRadius: '0.75rem',
  },
  textField: {
    [breakpoints.up('sm')]: {
      marginBottom: spacing(3),
    },
  },
  attachmentContainer: {
    width: '100%',
    height: '25rem',
    margin: `${spacing(2)} 0`,
    marginBottom: 'auto',
    position: 'relative',
    [breakpoints.up('md')]: {
      marginBottom: spacing(8),
    },
  },
  desktopSendButton: {
    minWidth: '7.5rem',
  },
  desktopSendButtonSpan: {
    marginLeft: 'auto',
  },
  attachmentImage: {
    objectFit: 'contain',
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
  },
}));

interface CreateCommentFormProps {
  target: CommentTarget;
  appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { loginRequiredTooltip, verificationRequiredTooltip, userMe, verified } = useAuthContext();
  const { isTabletOrDesktop } = useMediaQueries();
  const { screenshot, setScreenshot } = usePdfViewerContext();
  const { toggleNotification } = useNotificationsContext();
  const { isMobile } = useMediaQueries();
  const context = useLanguageHeaderContext();
  const attachmentInputRef = useRef<HTMLInputElement>(null!);
  const handleUploadAttachment = (): false | void => attachmentInputRef.current.click();

  const attachmentTooltip =
    loginRequiredTooltip || verificationRequiredTooltip || t('tooltips:attachFile');

  const {
    formRef,
    setSubmitting,
    resetForm,
    setFieldValue,
    submitForm,
  } = useForm<CreateCommentFormValues>();

  const {
    commentModalOpen,
    toggleCommentModal,
    commentAttachment,
    setCommentAttachment,
  } = useDiscussionContext();

  // Use screenshot as attachment if area has been marked.
  useEffect(() => {
    if (screenshot) {
      setCommentAttachment(screenshot); // Already in data URL form.
      const screenShotFile = dataURItoFile(screenshot);
      setFieldValue('attachment', screenShotFile);
    }
  }, [screenshot]);

  const handleCloseCreateCommentModal = (): void => {
    setFieldValue('attachment', null);
    toggleCommentModal(false);
    setCommentAttachment(null);
    !!setScreenshot && setScreenshot(null); // Not defined when in course page.
  };

  const onError = (): void => toggleNotification(t('notifications:messageError'));

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        onError();
      } else if (createComment.comment) {
        appendComments(createComment.comment as CommentObjectType);
      } else {
        onError();
      }
    } else {
      onError();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError,
  });

  const handleSubmit = async ({
    user: _user,
    text,
    attachment,
    ...values
  }: CreateCommentFormValues): Promise<void> => {
    if (!text && !attachment) {
      toggleNotification(t('notifications:messageEmpty'));
    } else {
      const user = R.prop('id', _user);

      await createCommentMutation({
        variables: { user, text, attachment, ...values },
        context,
      });

      resetForm();
      toggleCommentModal(false);
    }

    setSubmitting(false);
    setCommentAttachment(null);
  };

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    ...target,
  };

  const setAttachment = (file: File | Blob) => {
    setFieldValue('attachment', file);
    toggleCommentModal(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (): void => {
      setCommentAttachment(reader.result);
    };
  };

  // Automatically resize the image and update the field value.
  const handleAttachmentChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File = R.path(['currentTarget', 'files', '0'], e);

    const options = {
      maxSizeMB: MAX_COMMENT_ATTACHMENT_FILE_SIZE / 1000000,
      maxWidthOrHeight: MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
    };

    if (file.size > MAX_COMMENT_ATTACHMENT_FILE_SIZE) {
      try {
        const compressedFile = await imageCompression(file, options);
        setAttachment(compressedFile);
      } catch {
        toggleNotification(t('validation:fileSizeError'));
      }
    } else {
      setAttachment(file);
    }
  };

  const handleClearAttachment = (): void => {
    setFieldValue('attachment', null);
    setCommentAttachment(null);
  };

  const renderAuthorSelection = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && <AuthorSelection {...props} />;

  // For anonymous users and user without verification that are on mobile, hide the entire button.
  const renderAttachmentButton = ((isMobile && !!userMe && !!verified) || isTabletOrDesktop) && (
    <>
      <input
        ref={attachmentInputRef}
        value=""
        type="file"
        accept={ACCEPTED_ATTACHMENT_FILES.toString()}
        onChange={handleAttachmentChange}
        disabled={!userMe}
      />
      <Tooltip title={attachmentTooltip}>
        <Typography component="span">
          <IconButton
            onClick={handleUploadAttachment}
            disabled={verified === false || !userMe}
            size="small"
          >
            {isMobile ? <CameraAltOutlined /> : <AttachFileOutlined />}
          </IconButton>
        </Typography>
      </Tooltip>
    </>
  );

  const renderClearAttachmentButton = !!commentAttachment && (
    <Tooltip title={t('tooltips:clearAttachment')}>
      <Typography component="span">
        <IconButton onClick={handleClearAttachment} size="small">
          <ClearOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderAttachment = !!commentAttachment && (
    <Box className={clsx(classes.attachmentContainer, !!screenshot && 'screenshot-border')}>
      <Image
        layout="fill"
        className={classes.attachmentImage}
        src={String(commentAttachment)}
        unoptimized // Must be used for base64 images for now (v10.0.1). TODO: See if this is fixed in future Next.js versions.
        alt={t('common:commentAttachment')}
      />
    </Box>
  );

  const renderConductLink = <TextLink href={urls.conduct}>{t('common:conduct')}</TextLink>;

  const renderHelperText = (
    <FormHelperText className={classes.helperText}>
      {t('common:commentHelperText')} {renderConductLink}.
    </FormHelperText>
  );

  const renderDialogToolbar = (
    <Grid container>
      <Grid item xs={2} container>
        {renderAttachmentButton}
        {renderClearAttachmentButton}
      </Grid>
      <Grid item xs={10} container justify="flex-end" alignItems="center">
        {renderHelperText}
      </Grid>
    </Grid>
  );

  const renderTextField = (
    <Field
      name="text"
      component={TextFormField}
      placeholder={`${t('forms:createComment')}...`}
      rows="4"
      multiline
      className={classes.textField}
      margin="dense"
      InputProps={{
        className: classes.textFieldInputProps,
      }}
    />
  );

  const renderDesktopSendButton = ({ values }: FormikProps<CreateCommentFormValues>) => (
    <Tooltip title={t('tooltips:sendMessage')}>
      <Typography className={classes.desktopSendButtonSpan} component="span">
        <Button
          onClick={submitForm}
          variant="contained"
          color="primary"
          className={classes.desktopSendButton}
          disabled={!values.text && !commentAttachment} // Require either text content or an attachment.
          endIcon={<SendOutlined />}
        >
          {t('common:send')}
        </Button>
      </Typography>
    </Tooltip>
  );

  const renderDialogSendButton = ({
    values,
  }: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Tooltip title={t('tooltips:sendMessage')}>
      <Typography component="span">
        <IconButton
          onClick={submitForm}
          color="primary"
          disabled={!values.text && !commentAttachment} // Require either text content or an attachment.
        >
          <SendOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderDesktopTopToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid container spacing={2}>
      <Grid item xs={6} container>
        {renderAuthorSelection(props)}
      </Grid>
      <Grid item xs={6} container justify="flex-end" alignItems="center">
        {renderHelperText}
      </Grid>
    </Grid>
  );

  const renderDesktopBottomToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid container alignItems="center">
      {renderAttachmentButton}
      {renderClearAttachmentButton}
      {renderDesktopSendButton(props)}
    </Grid>
  );

  const renderDesktopInput = (props: FormikProps<CreateCommentFormValues>) =>
    isTabletOrDesktop && (
      <>
        {renderDesktopTopToolbar(props)}
        {renderTextField}
        {renderDesktopBottomToolbar(props)}
      </>
    );

  const renderHeaderCenter = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <Grid container justify="flex-start" alignItems="center">
        {renderAuthorSelection(props)}
      </Grid>
    );

  const renderCreateCommentModal = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
      <DialogHeader
        headerCenter={renderHeaderCenter(props)} // Rendered for authenticated users.
        headerRight={renderDialogSendButton(props)}
        text={t('forms:createComment')} // Rendered for anonymous users.
        onCancel={handleCloseCreateCommentModal}
        cancelLeft
      />
      <DialogContent className={classes.dialogContent}>
        <Grid
          className={classes.container}
          container
          direction="column"
          justify="flex-end"
          wrap="nowrap"
        >
          {renderAttachment}
          {renderDialogToolbar}
          {renderTextField}
        </Grid>
      </DialogContent>
    </SkoleDialog>
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.container}>
      {renderDesktopInput(props)}
      {renderCreateCommentModal(props)}
    </Form>
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );
};
