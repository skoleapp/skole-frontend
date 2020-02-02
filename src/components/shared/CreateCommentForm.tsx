import React from 'react';
import { Formik, Field } from 'formik';
import { useTranslation } from '../../i18n';
import { StyledForm } from './StyledForm';
import { TextField } from 'formik-material-ui';
import { useDispatch } from 'react-redux';
import { toggleNotification } from '../../actions';
import { useCreateCommentMutation, CreateCommentMutation } from '../../../generated/graphql';
import { useForm } from '../../utils';
import { CommentTarget } from '../../types';

interface Props {
    label: string;
    placeholder: string;
    target: CommentTarget;
}

interface CreateCommentFormValues {
    text: string;
    attachment: string;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

export const CreateCommentForm: React.FC<Props> = ({ label, placeholder, target }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting } = useForm<CreateCommentFormValues>();

    const onError = (): void => {
        dispatch(toggleNotification(t('notifications:messageError')));
    };

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (createComment && createComment.errors) {
            onError();
        } else {
            dispatch(toggleNotification(t('notifications:messageSubmitted')));
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        await createCommentMutation({ variables: { ...values } });
        setSubmitting(false);
    };

    const initialValues = {
        text: '',
        attachment: '',
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(): JSX.Element => (
                <StyledForm>
                    <Field
                        name="text"
                        label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                    />
                    <input type="submit" value="Submit" />
                </StyledForm>
            )}
        </Formik>
    );
};
