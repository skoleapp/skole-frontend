import {
  Box,
  Button,
  DialogContent,
  Fab,
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
import { dataUriToFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';
import {
  ACCEPTED_ATTACHMENT_FILES,
  MAX_COMMENT_ATTACHMENT_FILE_SIZE,
  MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
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
  desktopContainer: {
    [breakpoints.up('md')]: {
      padding: spacing(2),
    },
  },
  desktopTextField: {
    margin: `${spacing(2)} 0`,
  },
  dialogTextField: {
    margin: 0,
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
  dialogToolbar: {
    margin: `${spacing(2)} 0`,
  },
  dialogSendButton: {
    marginLeft: spacing(2),
  },
  attachmentImage: {
    objectFit: 'contain',
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
    overflow: 'hidden',
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
  const { isMobile, isTabletOrDesktop, isDesktop } = useMediaQueries();
  const { screenshot, setScreenshot } = usePdfViewerContext();
  const { toggleNotification, unexpectedError } = useNotificationsContext();
  const { drawingMode } = usePdfViewerContext();
  const context = useLanguageHeaderContext();
  const attachmentInputRef = useRef<HTMLInputElement>(null!);
  const handleUploadAttachment = (): false | void => attachmentInputRef.current.click();

  const attachmentTooltip =
    loginRequiredTooltip || verificationRequiredTooltip || t('discussion-tooltips:attachFile');

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
    if (screenshot && !drawingMode) {
      setCommentAttachment(screenshot); // Already in data URL form.
      const screenShotFile = dataUriToFile(screenshot);
      setFieldValue('attachment', screenShotFile);
    }
  }, [screenshot, drawingMode]);

  const handleCloseCreateCommentModal = (): void => {
    setFieldValue('attachment', null);
    toggleCommentModal(false);
    setCommentAttachment(null);
    !!setScreenshot && setScreenshot(null); // Not defined when in course page.
  };

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        unexpectedError();
      } else if (createComment.comment) {
        appendComments(createComment.comment as CommentObjectType);
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: unexpectedError,
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

  // On desktop, submit form from enter key and add new line from Shift + Enter.
  const handleKeydown = (e: KeyboardEvent) => {
    if (isDesktop && e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitForm();
    }
  };

  const renderAuthorSelection = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && <AuthorSelection {...props} />;

  const renderHiddenAttachmentInput = (
    <input
      ref={attachmentInputRef}
      value=""
      type="file"
      accept={ACCEPTED_ATTACHMENT_FILES.toString()}
      onChange={handleAttachmentChange}
      disabled={!userMe}
    />
  );

  // For anonymous users and user without verification that are on mobile, hide the entire button.
  const renderAttachmentButton = ((isMobile && !!userMe && !!verified) || isTabletOrDesktop) && (
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
  );

  const renderClearAttachmentButton = ({
    values: { attachment },
  }: FormikProps<CreateCommentFormValues>) =>
    !!attachment && (
      <Tooltip title={t('discussion-tooltips:clearAttachment')}>
        <Typography component="span">
          <IconButton onClick={handleClearAttachment} size="small">
            <ClearOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
    );

  const renderAttachmentPreview = !!commentAttachment && (
    <Box className={clsx(classes.attachmentContainer, !!screenshot && 'screenshot-border')}>
      <Image
        layout="fill"
        className={classes.attachmentImage}
        src={String(commentAttachment)}
        unoptimized // Must be used for base64 images for now (v10.0.1). TODO: See if this is fixed in future Next.js versions.
        alt={t('discussion:attachmentAlt')}
      />
    </Box>
  );

  const textFieldProps = {
    name: 'text',
    component: TextFormField,
    placeholder: `${t('forms:createComment')}...`,
    multiline: true,
    rowsMax: '10',
    InputProps: {
      onKeyDown: handleKeydown,
    },
  };

  const renderDesktopTextField = (
    <Field {...textFieldProps} rows="4" className={classes.desktopTextField} />
  );

  const renderDialogTextField = <Field {...textFieldProps} className={classes.dialogTextField} />;

  const renderFormHelperText = isTabletOrDesktop && (
    <>
      <FormHelperText>
        {t('discussion:helperTextMarkdown')}{' '}
        <TextLink href="https://guides.github.com/features/mastering-markdown/" target="_blank">
          {t('discussion:markdown')}
        </TextLink>
        .
      </FormHelperText>
      <FormHelperText>
        {t('discussion:helperTextCombination', { combination: 'Shift + Enter' })}
      </FormHelperText>
    </>
  );

  const renderDialogToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid className={classes.dialogToolbar} container alignItems="center">
      <Grid item xs={4}>
        {renderAttachmentButton}
        {renderClearAttachmentButton(props)}
      </Grid>
      <Grid item xs={8} container alignItems="flex-end" direction="column">
        {renderFormHelperText}
      </Grid>
    </Grid>
  );

  const renderDialogSendButton = ({
    values: { text, attachment },
  }: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Tooltip title={t('discussion-tooltips:sendMessage')}>
      <Typography component="span">
        <Fab
          className={classes.dialogSendButton}
          size="small"
          color="primary"
          disabled={!text && !attachment} // Require either text content or an attachment.
          onClick={submitForm}
        >
          <SendOutlined />
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderDialogInput = (props: FormikProps<CreateCommentFormValues>) => (
    <Box display="flex" alignItems="center">
      {renderDialogTextField}
      {renderDialogSendButton(props)}
    </Box>
  );

  const renderDesktopSendButton = ({
    values: { text, attachment },
  }: FormikProps<CreateCommentFormValues>) => (
    <Tooltip title={t('discussion-tooltips:sendMessage')}>
      <Typography className={classes.desktopSendButtonSpan} component="span">
        <Button
          onClick={submitForm}
          variant="contained"
          color="primary"
          className={classes.desktopSendButton}
          disabled={!text && !attachment} // Require either text content or an attachment.
          endIcon={<SendOutlined />}
        >
          {t('common:send')}
        </Button>
      </Typography>
    </Tooltip>
  );

  const renderDesktopTopToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid container alignItems="center">
      <Grid item xs={6}>
        {renderAuthorSelection(props)}
      </Grid>
      <Grid item xs={6} container justify="flex-end">
        {renderFormHelperText}
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
        {renderDesktopTextField}
        {renderDesktopBottomToolbar(props)}
      </>
    );

  const renderHeaderCenter = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <Grid container justify="center">
        {renderAuthorSelection(props)}
      </Grid>
    );

  const renderDialogHeader = (props: FormikProps<CreateCommentFormValues>) => (
    <DialogHeader
      headerCenter={renderHeaderCenter(props)} // Rendered for authenticated users.
      text={t('forms:createComment')} // Rendered for anonymous users.
      onCancel={handleCloseCreateCommentModal}
    />
  );

  const renderDialogContent = (props: FormikProps<CreateCommentFormValues>) => (
    <DialogContent className={classes.dialogContent}>
      <Grid container direction="column" justify="flex-end" wrap="nowrap">
        {renderAttachmentPreview}
        {renderDialogToolbar(props)}
        {renderDialogInput(props)}
      </Grid>
    </DialogContent>
  );

  const renderCreateCommentModal = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
      {renderDialogHeader(props)}
      {renderDialogContent(props)}
    </SkoleDialog>
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.desktopContainer}>
      {renderDesktopInput(props)}
      {renderCreateCommentModal(props)}
      {renderHiddenAttachmentInput}
    </Form>
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );
};
