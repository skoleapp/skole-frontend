import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AttachFileOutlined from '@material-ui/icons/AttachFileOutlined';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import ImageOutlined from '@material-ui/icons/ImageOutlined';
import SendOutlined from '@material-ui/icons/SendOutlined';
import imageCompression from 'browser-image-compression';
import { useAuthContext, useNotificationsContext, useThreadContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import Image from 'next/image';
import * as R from 'ramda';
import React, { ChangeEvent, useCallback, useMemo, useRef } from 'react';
import { useMediaQueries } from 'styles';
import { CreateCommentFormValues } from 'types';
import {
  ACCEPTED_COMMENT_IMAGE_FILES,
  IMAGE_TYPES,
  MAX_COMMENT_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_WIDTH_HEIGHT,
} from 'utils';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { LoadingBox, MarkdownHelperText } from '../shared';
import { AuthorSelection } from './AuthorSelection';
import { CommentTextField } from './CommentTextField';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
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
  imagePreview: {
    marginBottom: 'auto',
  },
  desktopSendButton: {
    minWidth: '7.5rem',
  },
  desktopSendButtonSpan: {
    marginLeft: 'auto',
  },
  dialogSendButton: {
    marginLeft: spacing(2),
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
    overflow: 'hidden',
  },
  loadingDialogContent: {
    minHeight: '15rem',
    display: 'flex',
  },
}));

interface CreateCommentFormProps extends Pick<CreateCommentFormValues, 'thread' | 'comment'> {
  onCommentCreated: (topComment: boolean) => void;
  placeholder: string;
  resetTargetComment: () => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({
  thread,
  comment,
  onCommentCreated,
  placeholder,
  resetTargetComment,
}) => {
  const {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    setCommentImage,
    commentImage,
    commentFileName,
    setCommentFileName,
    formRef,
  } = useThreadContext();

  const classes = useStyles();
  const { t } = useTranslation();
  const { mdUp } = useMediaQueries();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { userMe } = useAuthContext();
  const commentImageInputRef = useRef<HTMLInputElement | null>(null);
  const commentFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadImage = useCallback((): false | void => commentImageInputRef.current?.click(), [
    commentImageInputRef,
  ]);

  const handleUploadFile = useCallback((): false | void => commentFileInputRef.current?.click(), [
    commentFileInputRef,
  ]);

  const handleCloseCreateCommentDialog = useCallback((): void => {
    formRef.current?.setFieldValue('image', null);
    setCreateCommentDialogOpen(false);
    setCommentImage(null);
    resetTargetComment();
  }, [formRef, resetTargetComment, setCommentImage, setCreateCommentDialogOpen]);

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (createComment?.successMessage) {
      toggleNotification(createComment.successMessage);
      onCommentCreated(!createComment.comment?.comment);
      sa_event('create_comment');
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const handleClearImage = useCallback((): void => {
    formRef.current?.setFieldValue('image', null);
    setCommentImage(null);
  }, [formRef, setCommentImage]);

  const handleClearFile = useCallback((): void => {
    formRef.current?.setFieldValue('file', null);
    setCommentFileName('');
  }, [formRef, setCommentFileName]);

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleSubmit = async ({
    user: _user,
    text,
    image,
    file,
    thread: _thread,
    comment: _comment,
  }: CreateCommentFormValues): Promise<void> => {
    if (!text && !image && !file) {
      toggleNotification(t('validation:textImageOrFileRequired'));
    } else {
      const user = R.prop('id', _user);
      const thread = R.prop('id', _thread);
      const comment = R.prop('id', _comment);

      const variables = {
        user,
        text,
        image,
        file,
        thread,
        comment,
      };

      // @ts-ignore: The mutation expects a string type for the `image` and `file` fields.
      await createCommentMutation({ variables });
      formRef.current?.resetForm();
      handleCloseCreateCommentDialog();
      formRef.current?.setSubmitting(false);
    }
  };

  const initialValues = useMemo(
    () => ({
      user: userMe,
      text: '',
      image: null,
      file: null,
      thread,
      comment,
    }),
    [userMe, thread, comment],
  );

  const setImage = useCallback(
    (file: File | Blob): void => {
      formRef.current?.setFieldValue('file', null);
      setCommentFileName('');
      formRef.current?.setFieldValue('image', file);
      setCreateCommentDialogOpen(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = (): void => {
        setCommentImage(reader.result);
      };
    },
    [formRef, setCommentImage, setCreateCommentDialogOpen, setCommentFileName],
  );

  const setFile = useCallback(
    (file: File | Blob): void => {
      formRef.current?.setFieldValue('image', null);
      setCommentImage(null);
      formRef.current?.setFieldValue('file', file);
      setCreateCommentDialogOpen(true);
      setCommentFileName(R.propOr('', 'name', file));
    },
    [formRef, setCreateCommentDialogOpen, setCommentFileName, setCommentImage],
  );

  // Automatically resize the image and update the field value.
  const handleImageInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file: File = R.path(['currentTarget', 'files', '0'], e);

      const options = {
        maxSizeMB: MAX_IMAGE_FILE_SIZE / 1000000,
        maxWidthOrHeight: MAX_IMAGE_WIDTH_HEIGHT,
      };

      if (file.size > MAX_IMAGE_FILE_SIZE) {
        try {
          const compressedFile = await imageCompression(file, options);
          setImage(compressedFile);
        } catch {
          toggleNotification(t('validation:fileSizeError'));
        }
      } else {
        setImage(file);
      }
    },
    [setImage, t, toggleNotification],
  );

  const validateAndSetFile = useCallback(
    (file: File | Blob): void => {
      if (file.size > MAX_COMMENT_FILE_SIZE) {
        toggleNotification(t('validation:fileSizeError'));
      } else {
        setFile(file);
      }
    },
    [setFile, t, toggleNotification],
  );

  // If the file is an image, automatically resize it.
  // Otherwise, check if it's too large and update the field value.
  const handleFileInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file: File = R.path(['currentTarget', 'files', '0'], e);

      if (IMAGE_TYPES.includes(file.type)) {
        const options = {
          maxSizeMB: MAX_COMMENT_FILE_SIZE / 1000000, // Convert to megabytes.,
          maxWidthOrHeight: MAX_IMAGE_WIDTH_HEIGHT,
        };

        try {
          const compressedFile = await imageCompression(file, options);
          validateAndSetFile(compressedFile);
        } catch {
          // Compression failed. Try to set the field value still if the image is small enough.
          validateAndSetFile(file);
        }
      } else {
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile],
  );

  const renderMarkdownHelperText = useMemo(
    () => (
      <FormHelperText>
        <MarkdownHelperText />
      </FormHelperText>
    ),
    [],
  );

  const renderCombinationHelperText = useMemo(
    () =>
      mdUp && (
        <FormHelperText>
          {t('forms:newLineHelperText', { combination: 'Shift + Enter' })}
        </FormHelperText>
      ),
    [mdUp, t],
  );

  const renderCommentImageButton = useMemo(
    () => (
      <Tooltip title={t('thread-tooltips:addCommentImage')}>
        <Typography component="span">
          <IconButton onClick={handleUploadImage} size="small">
            <ImageOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
    ),
    [handleUploadImage, t],
  );

  const renderCommentFileButton = useMemo(
    () => (
      <Tooltip title={t('thread-tooltips:addCommentFile')}>
        <Typography component="span">
          <IconButton onClick={handleUploadFile} size="small">
            <AttachFileOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
    ),
    [handleUploadFile, t],
  );

  const renderClearCommentImageButton = useMemo(
    () =>
      commentImage && (
        <Tooltip title={t('thread-tooltips:clearCommentImage')}>
          <Typography component="span">
            <IconButton onClick={handleClearImage} size="small">
              <ClearOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      ),
    [commentImage, handleClearImage, t],
  );

  const renderClearCommentFileButton = useMemo(
    () =>
      commentFileName && (
        <Tooltip title={t('thread-tooltips:clearCommentFile')}>
          <Typography component="span">
            <IconButton onClick={handleClearFile} size="small">
              <ClearOutlined />
            </IconButton>
          </Typography>
        </Tooltip>
      ),
    [commentFileName, handleClearFile, t],
  );

  const renderDialogTextFieldToolbar = useMemo(
    () => (
      <FormControl>
        <Grid container alignItems="center">
          <Grid item xs={8} container direction="column">
            {renderMarkdownHelperText}
            {renderCombinationHelperText}
          </Grid>
          <Grid item xs={4} container justify="flex-end">
            {renderCommentFileButton}
            {renderCommentImageButton}
            {renderClearCommentImageButton}
            {renderClearCommentFileButton}
          </Grid>
        </Grid>
      </FormControl>
    ),
    [
      renderClearCommentImageButton,
      renderClearCommentFileButton,
      renderCommentImageButton,
      renderCombinationHelperText,
      renderMarkdownHelperText,
      renderCommentFileButton,
    ],
  );

  const renderCommentImageInput = useMemo(
    () => (
      <input
        ref={commentImageInputRef}
        value=""
        type="file"
        accept={ACCEPTED_COMMENT_IMAGE_FILES.toString()}
        onChange={handleImageInputChange}
        disabled={!userMe}
      />
    ),
    [commentImageInputRef, handleImageInputChange, userMe],
  );

  const renderCommentFileInput = useMemo(
    () => (
      <input
        ref={commentFileInputRef}
        value=""
        type="file"
        onChange={handleFileInputChange}
        disabled={!userMe}
      />
    ),
    [commentFileInputRef, handleFileInputChange, userMe],
  );

  const renderImagePreview = useMemo(
    () =>
      commentImage && (
        <FormControl className={classes.imagePreview}>
          <Image
            layout="responsive"
            width={1280}
            height={720}
            src={String(commentImage)}
            alt={t('alt-texts:commentImage')}
            objectFit="contain"
          />
        </FormControl>
      ),
    [classes.imagePreview, commentImage, t],
  );

  const renderFileSelected = useMemo(
    () =>
      commentFileName && (
        <FormControl>
          <FormHelperText>{t('common:commentFileSelected', { commentFileName })}</FormHelperText>
        </FormControl>
      ),
    [commentFileName, t],
  );

  const renderAuthorSelection = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element | false =>
      !!userMe && <AuthorSelection {...props} />,
    [userMe],
  );

  const renderDialogAuthorSelection = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element | false =>
      !!userMe && <FormControl>{renderAuthorSelection(props)}</FormControl>,
    [renderAuthorSelection, userMe],
  );

  const renderDesktopTextField = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <CommentTextField
        placeholder={placeholder}
        value={createCommentDialogOpen ? '' : props.values.text}
        className={classes.desktopTextField}
        {...props}
      />
    ),
    [classes.desktopTextField, createCommentDialogOpen, placeholder],
  );

  const renderDialogTextField = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <CommentTextField
        placeholder={placeholder}
        className={classes.dialogTextField}
        rows="1"
        {...props}
      />
    ),
    [classes.dialogTextField, placeholder],
  );

  const renderDialogSendButton = useCallback(
    ({ values: { text, image } }: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <Tooltip title={t('thread-tooltips:sendMessage')}>
        <Typography component="span">
          <Fab
            className={classes.dialogSendButton}
            size="small"
            color="primary"
            disabled={!text && !image && !commentFileName} // Require either text, image or file.
            onClick={formRef.current?.submitForm}
          >
            <SendOutlined />
          </Fab>
        </Typography>
      </Tooltip>
    ),
    [classes.dialogSendButton, formRef, t, commentFileName],
  );

  const renderDialogInputArea = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <FormControl>
        <Grid container alignItems="center" wrap="nowrap">
          {renderDialogTextField(props)}
          {renderDialogSendButton(props)}
        </Grid>
      </FormControl>
    ),
    [renderDialogSendButton, renderDialogTextField],
  );

  const renderDesktopSendButton = useCallback(
    ({ values: { text, image } }: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <Typography className={classes.desktopSendButtonSpan} component="span">
        <Button
          variant="contained"
          color="primary"
          className={classes.desktopSendButton}
          disabled={(!text && !image) || createCommentDialogOpen} // Require either text content or an image.
          type="submit"
          endIcon={<SendOutlined />}
        >
          {t('common:send')}
        </Button>
      </Typography>
    ),
    [classes.desktopSendButton, classes.desktopSendButtonSpan, createCommentDialogOpen, t],
  );

  const renderDesktopTopToolbar = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={6}>
          {renderAuthorSelection(props)}
        </Grid>
        <Grid item xs={6} container direction="column" alignItems="flex-end">
          {renderMarkdownHelperText}
          {renderCombinationHelperText}
        </Grid>
      </Grid>
    ),
    [renderAuthorSelection, renderCombinationHelperText, renderMarkdownHelperText],
  );

  const renderDesktopBottomToolbar = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <Grid container alignItems="center" wrap="nowrap">
        {renderCommentImageButton}
        {renderCommentFileButton}
        {renderDesktopSendButton(props)}
      </Grid>
    ),
    [renderCommentImageButton, renderDesktopSendButton, renderCommentFileButton],
  );

  const renderDesktopInputArea = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element | false =>
      mdUp && (
        <>
          {renderDesktopTopToolbar(props)}
          {renderDesktopTextField(props)}
          {renderDesktopBottomToolbar(props)}
        </>
      ),
    [renderDesktopBottomToolbar, renderDesktopTextField, renderDesktopTopToolbar, mdUp],
  );

  const renderDialogHeader = useMemo(
    () => (
      <DialogHeader
        text={t('common:addComment')}
        emoji="💬"
        onClose={handleCloseCreateCommentDialog}
      />
    ),
    [handleCloseCreateCommentDialog, t],
  );

  const renderDialogContent = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <DialogContent className={classes.dialogContent}>
        <Grid container direction="column" justify="flex-end" wrap="nowrap">
          {renderImagePreview}
          {renderDialogAuthorSelection(props)}
          {renderDialogTextFieldToolbar}
          {renderFileSelected}
          {renderDialogInputArea(props)}
        </Grid>
      </DialogContent>
    ),
    [
      classes.dialogContent,
      renderDialogAuthorSelection,
      renderDialogInputArea,
      renderDialogTextFieldToolbar,
      renderImagePreview,
      renderFileSelected,
    ],
  );

  const renderCreateCommentDialog = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <SkoleDialog open={createCommentDialogOpen} onClose={handleCloseCreateCommentDialog}>
        {renderDialogHeader}
        {renderDialogContent(props)}
      </SkoleDialog>
    ),
    [
      createCommentDialogOpen,
      handleCloseCreateCommentDialog,
      renderDialogContent,
      renderDialogHeader,
    ],
  );

  const renderLoadingDialog = useCallback(
    ({ isSubmitting }: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <SkoleDialog open={isSubmitting} fullScreen={false} fullWidth>
        <DialogContent className={classes.loadingDialogContent}>
          <LoadingBox text={t('thread:postingComment')} />
        </DialogContent>
      </SkoleDialog>
    ),
    [classes.loadingDialogContent, t],
  );

  const renderFormFields = useCallback(
    (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
      <Form className={classes.desktopContainer}>
        {renderDesktopInputArea(props)}
        {renderCreateCommentDialog(props)}
        {renderLoadingDialog(props)}
        {renderCommentImageInput}
        {renderCommentFileInput}
      </Form>
    ),
    [
      classes.desktopContainer,
      renderCommentImageInput,
      renderCommentFileInput,
      renderCreateCommentDialog,
      renderDesktopInputArea,
      renderLoadingDialog,
    ],
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );
};
