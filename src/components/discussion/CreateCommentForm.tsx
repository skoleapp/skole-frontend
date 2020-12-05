import {
  Avatar,
  Box,
  DialogContent,
  Grid,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { DeviceUnknownOutlined, KeyboardArrowDown } from '@material-ui/icons';
import clsx from 'clsx';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
} from 'context';
import { Form, Formik, FormikProps } from 'formik';
import {
  CommentObjectType,
  CreateCommentMutation,
  useCreateCommentMutation,
  UserObjectType,
} from 'generated';
import { useForm, useLanguageHeaderContext, useMediaQueries, useOpen } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';
import { mediaUrl } from 'utils';
import * as R from 'ramda';
import { DialogHeader, ResponsiveDialog, SkoleDialog } from '../shared';
import { RichTextEditor } from './RichTextEditor';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
  attachmentImage: {
    objectFit: 'contain',
  },
  container: {
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
  },
  authorSelection: {
    cursor: 'pointer',
  },
}));

interface CreateCommentFormProps {
  target: CommentTarget;
  appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { screenshot, setScreenshot } = usePdfViewerContext();
  const { toggleNotification } = useNotificationsContext();
  const { formRef, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();
  const { userMe } = useAuthContext();
  const username = R.prop('username', userMe);
  const context = useLanguageHeaderContext();

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

  const {
    open: authorSelectionOpen,
    handleOpen: handleOpenAuthorSelection,
    handleClose: handleCloseAuthorSelection,
  } = useOpen();

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    ...target,
  };

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

  const renderRichTextEditor = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <RichTextEditor {...props} />
  );

  const renderDesktopInputArea = (
    props: FormikProps<CreateCommentFormValues>,
  ): false | JSX.Element => isTabletOrDesktop && renderRichTextEditor(props);

  const renderHeaderLeft = ({ values }: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <Avatar
        className="avatar-thumbnail"
        src={mediaUrl(R.pathOr('', ['user', 'avatarThumbnail'], values))}
      />
    );

  const renderAuthorName = (user: UserObjectType | null) =>
    user ? (
      <Typography variant="body2">{user.username}</Typography>
    ) : (
      <Typography variant="body2" color="textSecondary">
        {t('common:communityUser')}
      </Typography>
    );

  const renderAuthorSelectionText = (user: UserObjectType | null) => (
    <Typography variant="body2" color="textSecondary">
      <Grid container alignItems="center">
        {user ? t('common:postWithAccount') : t('common:postAsAnonymous')} <KeyboardArrowDown />
      </Grid>
    </Typography>
  );

  const renderHeaderCenter = ({ values }: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <Grid
        onClick={handleOpenAuthorSelection}
        className={classes.authorSelection}
        container
        direction="column"
      >
        {renderAuthorName(values.user)}
        {renderAuthorSelectionText(values.user)}
      </Grid>
    );

  const renderCreateCommentModal = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
      <DialogHeader
        headerLeft={renderHeaderLeft(props)}
        headerCenter={renderHeaderCenter(props)}
        text={t('forms:createComment')}
        onCancel={handleCloseCreateCommentModal}
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
          {renderRichTextEditor(props)}
        </Grid>
      </DialogContent>
    </SkoleDialog>
  );

  const authorSelectionDialogHeaderProps = {
    text: t('common:selectAuthor'),
    onCancel: handleCloseAuthorSelection,
  };

  const renderAuthenticatedMenuItem = ({ values }: FormikProps<CreateCommentFormValues>) => (
    <MenuItem
      onClick={() => {
        setFieldValue('user', userMe);
        handleCloseAuthorSelection();
      }}
    >
      <ListItemIcon>
        <Avatar
          className="avatar-thumbnail"
          src={mediaUrl(R.pathOr('', ['user', 'avatarThumbnail'], values))}
        />
      </ListItemIcon>
      <ListItemText>{t('common:postAs', { username })}</ListItemText>
    </MenuItem>
  );

  const renderAnonymousMenuItem = ({ setFieldValue }: FormikProps<CreateCommentFormValues>) => (
    <MenuItem
      onClick={() => {
        setFieldValue('user', null);
        handleCloseAuthorSelection();
      }}
    >
      <ListItemIcon>
        <DeviceUnknownOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:postAsAnonymous')}</ListItemText>
    </MenuItem>
  );

  const renderAuthorSelectionModal = (
    props: FormikProps<CreateCommentFormValues>,
  ): JSX.Element | false =>
    !!userMe && (
      <ResponsiveDialog
        open={authorSelectionOpen}
        onClose={handleCloseAuthorSelection}
        dialogHeaderProps={authorSelectionDialogHeaderProps}
      >
        <List>
          {renderAuthenticatedMenuItem(props)}
          {renderAnonymousMenuItem(props)}
        </List>
      </ResponsiveDialog>
    );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.container}>
      {renderDesktopInputArea(props)}
      {renderCreateCommentModal(props)}
      {renderAuthorSelectionModal(props)}
    </Form>
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );
};
