import { Dialog, DialogContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useDiscussionContext, useNotificationsContext, usePDFViewerContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm, useMediaQueries } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import React, { useEffect } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';

import { ModalHeader } from '..';
import { Transition } from '../shared';
import { RichTextEditor } from './RichTextEditor';

const useStyles = makeStyles(({ spacing }) => ({
    attachment: {
        width: '100%',
        height: 'auto',
        maxHeight: '25rem',
        margin: `${spacing(2)} 0`,
    },
    container: {
        flexGrow: 1,
    },
    dialogContent: {
        display: 'flex',
    },
}));

type T = FormikProps<CreateCommentFormValues>;

interface CreateCommentFormProps {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { isDesktop, isMobileOrTablet } = useMediaQueries();
    const { ref, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { commentModalOpen, toggleCommentModal, commentAttachment, setCommentAttachment } = useDiscussionContext();
    const { screenshot, setScreenshot } = usePDFViewerContext();

    // Use screenshot as attachment if area has been marked.
    useEffect(() => {
        if (!!screenshot) {
            setCommentAttachment(screenshot); // Already in data URL form.
            const screenShotFile = dataURItoFile(screenshot);
            setFieldValue('attachment', screenShotFile);
        }
    }, [screenshot]);

    const handleCloseCreateCommentModal = (): void => {
        setFieldValue('attachment', null);
        toggleCommentModal(false);
        setScreenshot(null);
        setCommentAttachment(null);
    };

    const onError = (): void => toggleNotification(t('notifications:messageError'));

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (!!createComment) {
            if (!!createComment.errors) {
                onError();
            } else if (!!createComment.comment && !!createComment.message) {
                toggleNotification(createComment.message);
                appendComments(createComment.comment as CommentObjectType);
            } else {
                onError();
            }
        } else {
            onError();
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        if (!commentAttachment && !values.text) {
            toggleNotification(t('notifications:messageEmpty'));
        } else {
            await createCommentMutation({
                variables: { ...values, attachment: (values.attachment as unknown) as string },
            });

            resetForm();
            toggleCommentModal(false);
        }

        setSubmitting(false);
        setCommentAttachment(null);
    };

    const initialValues = {
        text: '',
        attachment: null,
        ...target,
    };

    const renderDesktopInputArea = (formikProps: T): false | JSX.Element =>
        isDesktop && <RichTextEditor {...formikProps} />;

    const renderAttachment = !!commentAttachment && (
        <img
            className={clsx(classes.attachment, !!screenshot && 'screenshot-border')}
            src={commentAttachment as string}
            alt={commentAttachment as string}
        />
    );

    const renderRichTextEditor = (formikProps: T): JSX.Element => <RichTextEditor {...formikProps} />;

    const renderCreateCommentModal = (formikProps: T): JSX.Element => (
        <Dialog
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            open={commentModalOpen}
            onClose={handleCloseCreateCommentModal}
            TransitionComponent={Transition}
        >
            <ModalHeader onCancel={handleCloseCreateCommentModal} text={t('forms:createComment')} />
            <DialogContent className={classes.dialogContent}>
                <Grid className={classes.container} container direction="column">
                    {renderAttachment}
                    {renderRichTextEditor(formikProps)}
                </Grid>
            </DialogContent>
        </Dialog>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <Form className={classes.container}>
                    {renderDesktopInputArea(props)}
                    {renderCreateCommentModal(props)}
                </Form>
            )}
        </Formik>
    );
};
