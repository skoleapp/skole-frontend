import { Box, Fade, IconButton, Paper } from '@material-ui/core';
import { AttachFileOutlined, SendOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import Image from 'material-ui-image';
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
            dispatch(toggleNotification('notifications:messageEmpty'));
        }

        resetForm();
        setSubmitting(false);
    };

    const handleKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submitForm();
        }
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

    const renderTextField = (
        <Field
            name="text"
            placeholder={t('forms:message')}
            component={TextField}
            variant="outlined"
            onKeyPress={handleKeyPress}
            rowsMax="10"
            multiline={true}
            autoComplete="off"
            fullWidth
        />
    );

    const renderSubmitButton = (
        <Box marginLeft="0.5rem">
            <IconButton onClick={submitForm} color="primary">
                <SendOutlined />
            </IconButton>
        </Box>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(): JSX.Element => (
                <StyledCreateCommentForm>
                    <Box display="flex" alignItems="center">
                        {renderTextField}
                        <input
                            value=""
                            id="attachment"
                            accept="image/*"
                            type="file"
                            onChange={handleAttachmentChange}
                        />
                        <label htmlFor="attachment">
                            <Box marginLeft="0.5rem">
                                <IconButton component="span">
                                    <AttachFileOutlined />
                                </IconButton>
                            </Box>
                        </label>
                    </Box>
                    <StyledModal open={!!attachmentModal} onClose={handleCloseAttachmentModal}>
                        <Fade in={!!attachmentModal}>
                            <Paper>
                                <ModalHeader onClick={handleCloseAttachmentModal} title={t('common:attachFile')} />
                                <Box flexGrow="1">{!!attachmentModal && <Image src={attachmentModal as string} />}</Box>
                                <Box display="flex" alignItems="center">
                                    {renderTextField}
                                    {renderSubmitButton}
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

    .MuiFormControl-root {
        margin-top: 0;
    }

    input#attachment {
        display: none;
    }
`;
