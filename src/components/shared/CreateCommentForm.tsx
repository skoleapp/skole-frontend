import { Box, IconButton, TextField } from '@material-ui/core';
import { AttachmentOutlined } from '@material-ui/icons';
import { Field, Formik } from 'formik';
import React from 'react';
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
    attachment: string;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

export const CreateCommentForm: React.FC<Props> = ({ appendComments, target }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, submitForm } = useForm<CreateCommentFormValues>();

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
        console.log(values);
        await createCommentMutation({ variables: { ...values } });
        setSubmitting(false);
        resetForm();
    };

    const handleKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submitForm();
        }
    };

    const initialValues = {
        text: '',
        attachment: '',
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(): JSX.Element => (
                <StyledCreateCommentForm>
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton>
                            <AttachmentOutlined />
                        </IconButton>
                    </Box>
                    <Field
                        name="text"
                        placeholder={t('forms:message')}
                        variant="outlined"
                        component={TextField}
                        autoComplete="off"
                        rowsMax="10"
                        onKeyPress={handleKeyPress}
                        multiline
                        fullWidth
                    />
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(StyledForm)`
    display: flex;
    flex-direction: column;

    .MuiIconButton-root {
        padding: 0.5rem;
    }

    .MuiFormControl-root {
        margin-top: 0.25rem;
    }
`;
