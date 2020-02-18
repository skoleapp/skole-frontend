import { Box, IconButton, Typography } from '@material-ui/core';
import { AttachmentOutlined, SendOutlined } from '@material-ui/icons';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { StyledForm } from './StyledForm';

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
        await createCommentMutation({ variables: { ...values, attachment: (values.attachment as unknown) as string } });
        setSubmitting(false);
        resetForm();
    };

    const handleKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submitForm();
        }
    };

    const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const attachment = R.path(['currentTarget', 'files', '0'], e) as File;
        setFieldValue('attachment', attachment);
        reader.readAsDataURL(attachment);

        reader.onloadend = (): void => {
            setFieldValue('attachment', attachment);
        };
    };

    const initialValues = {
        text: '',
        attachment: null,
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {({ values }): JSX.Element => (
                <StyledCreateCommentForm>
                    <Field
                        name="text"
                        placeholder={t('forms:message')}
                        component={TextField}
                        variant="outlined"
                        onKeyPress={handleKeyPress}
                        rowsMax="10"
                        multiline
                        autoComplete="off"
                    />
                    <Box display="flex" justifyContent="space-between" marginTop="0.5rem">
                        <input
                            value=""
                            id="attachment"
                            accept="image/*"
                            type="file"
                            onChange={handleAttachmentChange}
                        />
                        <label htmlFor="attachment">
                            <IconButton
                                size="small"
                                component="span"
                                color={!!values.attachment ? 'primary' : 'default'}
                            >
                                <AttachmentOutlined />
                            </IconButton>
                        </label>
                        {!!values.attachment && (
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" color="textSecondary">
                                    File Uploaded: {values.attachment.name}
                                </Typography>
                            </Box>
                        )}
                        <IconButton size="small" color="primary" type="submit">
                            <SendOutlined />
                        </IconButton>
                    </Box>
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(StyledForm)`
    display: flex;
    flex-direction: column;

    .MuiFormControl-root {
        margin-top: 0;
    }

    input#attachment {
        display: none;
    }
`;
