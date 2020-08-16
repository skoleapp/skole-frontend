import { Box, Fade, Paper } from '@material-ui/core';
import { useDeviceContext, useDiscussionContext, useNotificationsContext, usePDFViewerContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'material-ui-image';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CommentTarget, CreateCommentFormValues } from 'types';

import { ModalHeader, StyledModal } from '..';
import { RichTextEditor } from './RichTextEditor';

type T = FormikProps<CreateCommentFormValues>;

interface CreateCommentFormProps {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
    const { t } = useTranslation();
    const { ref, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { commentModalOpen, toggleCommentModal, commentAttachment, setCommentAttachment } = useDiscussionContext();
    const { screenshot, setScreenshot } = usePDFViewerContext();
    const isMobile = useDeviceContext();

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
        !isMobile && <RichTextEditor {...formikProps} />;

    const renderCreateCommentModal = (formikProps: T): JSX.Element => (
        <StyledModal open={commentModalOpen} onClose={handleCloseCreateCommentModal} autoHeight>
            <Fade in={commentModalOpen}>
                <Paper>
                    <ModalHeader onCancel={handleCloseCreateCommentModal} text={t('forms:createComment')} />
                    <StyledAttachmentImage screenshot={screenshot}>
                        {!!commentAttachment && <Image src={commentAttachment as string} />}
                    </StyledAttachmentImage>
                    <RichTextEditor {...formikProps} />
                </Paper>
            </Fade>
        </StyledModal>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <StyledCreateCommentForm>
                    {renderDesktopInputArea(props)}
                    {renderCreateCommentModal(props)}
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(Form)`
    flex-grow: 1;
    display: flex;
`;

// Ignore: screenshot must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledAttachmentImage = styled(({ screenshot, ...props }) => <Box {...props} />)`
    margin-top: 0.5rem;
    flex-grow: 1;

    > div {
        padding-top: 0 !important;

        img {
            height: auto !important;
            position: relative !important;
            max-height: 25rem;

            // If attachment is a screenshot from a document, show a screenshot border around it.
            border: ${({ screenshot }): string => (!!screenshot ? 'var(--screenshot-border)' : 'none')};
        }
    }
`;
