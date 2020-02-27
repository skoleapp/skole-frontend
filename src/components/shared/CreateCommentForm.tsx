import { Box, Fab, Fade, IconButton, OutlinedTextFieldProps, Paper, TextField } from '@material-ui/core';
import { AttachFileOutlined, CameraAltOutlined, SendOutlined } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { ModalHeader } from './ModalHeader';
import { StyledModal } from './StyledModal';

interface Props {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
}

interface CreateCommentFormValues {
    text: string;
    attachment: File | null;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

export const CreateCommentForm: React.FC<Props> = ({ appendComments, target }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, submitForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const [attachmentModal, setAttachmentModal] = useState<string | ArrayBuffer | null>(null);

    const handleCloseAttachmentModal = (): void => {
        setFieldValue('attachment', null);
        setAttachmentModal(null);
    };

    const onError = (): void => {
        dispatch(toggleNotification(t('notifications:messageError')));
    };

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (createComment) {
            if (createComment.errors) {
                onError();
            } else if (createComment.comment) {
                dispatch(toggleNotification(t('notifications:messageSubmitted')));
                appendComments(createComment.comment as CommentObjectType);
            }
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        setAttachmentModal(null);

        if (!!values.text) {
            await createCommentMutation({
                variables: { ...values, attachment: (values.attachment as unknown) as string },
            });
        } else {
            dispatch(toggleNotification(t('notifications:messageEmpty')));
        }

        resetForm();
        setSubmitting(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setFieldValue('text', e.target.value);
    };

    const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const attachment = R.path(['currentTarget', 'files', '0'], e) as File;
        reader.readAsDataURL(attachment);

        reader.onloadend = (): void => {
            setFieldValue('attachment', attachment);
            setAttachmentModal(reader.result);
        };
    };

    const initialValues = {
        text: '',
        attachment: null,
        ...target,
    };

    const textFieldProps: OutlinedTextFieldProps = {
        placeholder: t('forms:message'),
        variant: 'outlined',
        onChange: handleChange,
        rowsMax: '10',
        multiline: true,
        autoComplete: 'off',
        fullWidth: true,
    };

    const renderAttachmentButton = (
        <>
            <input value="" id="attachment" accept="image/*" type="file" onChange={handleAttachmentChange} />
            <label htmlFor="attachment">
                <Fab component="span">
                    <AttachFileOutlined />
                </Fab>
            </label>
        </>
    );

    const renderSubmitButton = (
        <IconButton onClick={submitForm} color="primary">
            <SendOutlined />
        </IconButton>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {({ values }): JSX.Element => (
                <StyledCreateCommentForm>
                    <Box className="md-down" display="flex" marginBottom="0.5rem">
                        <Box>{renderAttachmentButton}</Box>
                        <Box marginLeft="0.5rem">
                            <input
                                value=""
                                id="camera-attachment"
                                accept="image/*"
                                type="file"
                                capture="camera"
                                onChange={handleAttachmentChange}
                            />
                            <label htmlFor="camera-attachment">
                                <Fab component="span">
                                    <CameraAltOutlined />
                                </Fab>
                            </label>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box className="md-up" marginRight="0.5rem">
                            <input
                                value=""
                                id="attachment"
                                accept="image/*"
                                type="file"
                                onChange={handleAttachmentChange}
                            />
                            <label htmlFor="attachment">
                                <IconButton component="span">
                                    <AttachFileOutlined />
                                </IconButton>
                            </label>
                        </Box>
                        <TextField value={!attachmentModal ? values.text : ''} {...textFieldProps} />
                        <Box className="md-up" marginLeft="0.5rem">
                            {renderSubmitButton}
                        </Box>
                    </Box>
                    <StyledModal open={!!attachmentModal} onClose={handleCloseAttachmentModal} autoHeight>
                        <Fade in={!!attachmentModal}>
                            <Paper>
                                <ModalHeader
                                    onCancel={handleCloseAttachmentModal}
                                    headerRight={renderSubmitButton}
                                    title={t('common:attachFile')}
                                />
                                <Box className="attachment-container">
                                    {!!attachmentModal && (
                                        <img className="attachment" src={attachmentModal as string} />
                                    )}
                                </Box>
                                <Box className="modal-input-area">
                                    <TextField value={!!attachmentModal ? values.text : ''} {...textFieldProps} />
                                </Box>
                            </Paper>
                        </Fade>
                    </StyledModal>
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(Form)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .MuiFormControl-root {
        margin-top: 0;
    }

    input#attachment,
    input#camera-attachment {
        display: none;
    }
`;
