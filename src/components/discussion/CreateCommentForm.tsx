import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AttachFileOutlined from '@material-ui/icons/AttachFileOutlined';
import CameraAltOutlined from '@material-ui/icons/CameraAltOutlined';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import SendOutlined from '@material-ui/icons/SendOutlined';
import imageCompression from 'browser-image-compression';
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
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';
import {
  ACCEPTED_ATTACHMENT_FILES,
  MAX_COMMENT_ATTACHMENT_FILE_SIZE,
  MAX_COMMENT_ATTACHMENT_WIDTH_HEIGHT,
} from 'utils';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { TextFormField } from '../form-fields';
import { TextLink } from '../shared';
import { AuthorSelection } from './AuthorSelection';

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
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { drawingMode } = usePdfViewerContext();
  const context = useLanguageHeaderContext();
  const attachmentInputRef = useRef<HTMLInputElement>(null!);
  const handleUploadAttachment = (): false | void => attachmentInputRef.current.click();
  const { formRef } = useForm<CreateCommentFormValues>();

  const attachmentTooltip =
    loginRequiredTooltip || verificationRequiredTooltip || t('discussion-tooltips:attachFile');

  const {
    commentDialogOpen,
    toggleCommentDialog,
    commentAttachment,
    setCommentAttachment,
  } = useDiscussionContext();

  // Use screenshot as attachment if area has been marked and drawing mode is toggled off.
  useEffect(() => {
    if (screenshot && !drawingMode) {
      setCommentAttachment(screenshot); // Already in data URL form.
      const screenShotFile = dataUriToFile(screenshot);
      formRef.current?.setFieldValue('attachment', screenShotFile);
    }
  }, [screenshot, drawingMode]);

  const handleCloseCreateCommentDialog = (): void => {
    formRef.current?.setFieldValue('attachment', null);
    toggleCommentDialog(false);
    setCommentAttachment(null);
    !!setScreenshot && setScreenshot(null); // Not defined when in course page.
  };

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (createComment.comment) {
        appendComments(createComment.comment as CommentObjectType);
      } else {
        toggleUnexpectedErrorNotification();
      }
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
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

      formRef.current?.resetForm();
      toggleCommentDialog(false);
    }

    formRef.current?.setSubmitting(false);
    setCommentAttachment(null);
  };

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    ...target,
  };

  const setAttachment = (file: File | Blob) => {
    formRef.current?.setFieldValue('attachment', file);
    toggleCommentDialog(true);

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
    formRef.current?.setFieldValue('attachment', null);
    setCommentAttachment(null);
  };

  // On desktop, submit form from enter key and add new line from Shift + Enter.
  const handleKeydown = (e: KeyboardEvent) => {
    if (isDesktop && e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.submitForm();
    }
  };

  const submitForm = () => formRef.current?.submitForm();

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
        <TextLink href="https://commonmark.org/help/" target="_blank">
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
      emoji="💬"
      onCancel={handleCloseCreateCommentDialog}
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

  const renderCreateCommentDialog = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentDialogOpen} onClose={handleCloseCreateCommentDialog}>
      {renderDialogHeader(props)}
      {renderDialogContent(props)}
    </SkoleDialog>
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.desktopContainer}>
      {renderDesktopInput(props)}
      {renderCreateCommentDialog(props)}
      {renderHiddenAttachmentInput}
    </Form>
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );
};
